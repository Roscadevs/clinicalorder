#!/usr/bin/env python3
"""
Ad-Hoc Transactional Mutation Testing Runner for Spring Boot Backend.
Fase 25 - Clinica Dermatologica.

Features:
- In-memory backup and physical .original_bak file protection.
- POSIX signal handling (SIGINT, SIGTERM, SIGHUP) for atomic rollback.
- Exact substring substitution with uniqueness assertion.
- Two-tier execution: Targeted test class first, full suite confirmation on survival.
- Classification: KILLED, SURVIVED, COMPILATION_ERROR, TIMEOUT.
- Guaranteed atomic restoration in finally block verified by git diff --exit-code.
- JSON and Markdown reporting in documentacion/.
"""

import argparse
import datetime
import json
import os
import re
import signal
import subprocess
import sys
import time

JAVA_HOME = os.environ.get("JAVA_HOME", "/opt/homebrew/opt/openjdk@17")
DEFAULT_CATALOG_PATH = os.path.join(os.path.dirname(__file__), "mutants_catalog.json")
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
REPORT_JSON_PATH = os.path.join(PROJECT_ROOT, "documentacion", "reportes", "mutation_report.json")
REPORT_MD_PATH = os.path.join(PROJECT_ROOT, "documentacion", "reportes", "mutation_report.md")

# Global state for emergency signal cleanup
active_mutation = None  # (target_file_path, original_content, backup_file_path)


def signal_handler(signum, frame):
    global active_mutation
    print(f"\n[MUTATION RUNNER] Intercepted signal {signum}. Performing emergency rollback...", file=sys.stderr)
    if active_mutation:
        target_path, original_content, backup_path = active_mutation
        try:
            if os.path.exists(target_path):
                with open(target_path, "w", encoding="utf-8") as f:
                    f.write(original_content)
                print(f"[MUTATION RUNNER] Restored {target_path}", file=sys.stderr)
            if backup_path and os.path.exists(backup_path):
                os.remove(backup_path)
            subprocess.run(["git", "diff", "--exit-code", target_path], cwd=PROJECT_ROOT, check=False)
        except Exception as e:
            print(f"[MUTATION RUNNER] Emergency rollback error: {e}", file=sys.stderr)
    sys.exit(130)


signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)
if hasattr(signal, "SIGHUP"):
    signal.signal(signal.SIGHUP, signal_handler)


def verify_git_clean(file_path=None):
    cmd = ["git", "diff", "--exit-code"]
    if file_path:
        rel_path = os.path.relpath(file_path, PROJECT_ROOT)
        cmd.append(rel_path)
    res = subprocess.run(cmd, cwd=PROJECT_ROOT, capture_output=True, text=True)
    return res.returncode == 0, res.stderr or res.stdout


def run_maven_test(test_class=None, timeout_sec=90, verbose=False):
    env = os.environ.copy()
    env["JAVA_HOME"] = JAVA_HOME
    env["PATH"] = f"{JAVA_HOME}/bin:" + env.get("PATH", "")

    cmd = ["mvn", "test", "-B"]
    if test_class:
        cmd.append(f"-Dtest={test_class}")

    start_time = time.time()
    try:
        proc = subprocess.run(
            cmd,
            cwd=BACKEND_DIR,
            env=env,
            capture_output=True,
            text=True,
            timeout=timeout_sec
        )
        elapsed = time.time() - start_time
        output = proc.stdout + "\n" + proc.stderr
        
        if verbose:
            print(output)

        if "COMPILATION ERROR" in output or "[ERROR] COMPILATION ERROR" in output:
            return "COMPILATION_ERROR", elapsed, output, proc.returncode

        # Check for test failures or errors in Maven output
        # Look for "Failures: X, Errors: Y" where X > 0 or Y > 0
        match = re.search(r"Tests run:\s*(\d+),\s*Failures:\s*(\d+),\s*Errors:\s*(\d+),\s*Skipped:\s*(\d+)", output)
        if match:
            run_count = int(match.group(1))
            failures = int(match.group(2))
            errors = int(match.group(3))
            if failures > 0 or errors > 0:
                return "FAIL", elapsed, output, proc.returncode
            if proc.returncode == 0:
                return "PASS", elapsed, output, proc.returncode

        if proc.returncode != 0:
            # Non-zero returncode without explicit compilation error is a test failure or build failure
            return "FAIL", elapsed, output, proc.returncode
        return "PASS", elapsed, output, proc.returncode

    except subprocess.TimeoutExpired:
        elapsed = time.time() - start_time
        return "TIMEOUT", elapsed, "Execution timed out", -1


def execute_mutant(mutant, skip_full_suite=False, verbose=False):
    global active_mutation

    mutant_id = mutant["id"]
    target_file = os.path.join(PROJECT_ROOT, mutant["target_file"])
    target_test_class = mutant.get("target_test_class")
    original_code = mutant["original_code"]
    mutated_code = mutant["mutated_code"]

    if not os.path.exists(target_file):
        return {
            "id": mutant_id,
            "status": "ERROR_FILE_NOT_FOUND",
            "message": f"Target file not found: {target_file}",
            "elapsed": 0.0
        }

    with open(target_file, "r", encoding="utf-8") as f:
        original_content = f.read()

    count = original_content.count(original_code)
    if count == 0:
        return {
            "id": mutant_id,
            "status": "ERROR_PATTERN_NOT_FOUND",
            "message": f"Original code not found in {mutant['target_file']}",
            "elapsed": 0.0
        }
    if count > 1:
        return {
            "id": mutant_id,
            "status": "ERROR_AMBIGUOUS_PATTERN",
            "message": f"Original code found {count} times (not unique) in {mutant['target_file']}",
            "elapsed": 0.0
        }

    backup_file = target_file + ".original_bak"
    with open(backup_file, "w", encoding="utf-8") as f:
        f.write(original_content)

    mutated_content = original_content.replace(original_code, mutated_code, 1)

    active_mutation = (target_file, original_content, backup_file)
    result_status = "UNKNOWN"
    total_elapsed = 0.0
    killed_by = None
    output_summary = ""

    try:
        with open(target_file, "w", encoding="utf-8") as f:
            f.write(mutated_content)

        # Tier 1: Run targeted test class
        t1_status, t1_elapsed, t1_output, t1_rc = run_maven_test(
            test_class=target_test_class,
            verbose=verbose
        )
        total_elapsed += t1_elapsed

        if t1_status == "COMPILATION_ERROR":
            result_status = "COMPILATION_ERROR"
            output_summary = "Compilation error during targeted test execution"
        elif t1_status == "TIMEOUT":
            result_status = "TIMEOUT"
            output_summary = "Timed out during targeted test execution"
        elif t1_status == "FAIL":
            result_status = "KILLED"
            killed_by = target_test_class
            output_summary = f"Killed by targeted test class {target_test_class}"
        elif t1_status == "PASS":
            # Targeted test passed (mutant survived targeted test!)
            if skip_full_suite:
                result_status = "SURVIVED"
                output_summary = f"Survived targeted test class {target_test_class}"
            else:
                # Tier 2: Run full test suite to check for cross-service detection
                t2_status, t2_elapsed, t2_output, t2_rc = run_maven_test(
                    test_class=None,
                    verbose=verbose
                )
                total_elapsed += t2_elapsed
                if t2_status in ("FAIL", "KILLED"):
                    result_status = "KILLED"
                    killed_by = "FullTestSuite"
                    output_summary = "Killed by full test suite"
                elif t2_status == "COMPILATION_ERROR":
                    result_status = "COMPILATION_ERROR"
                    output_summary = "Compilation error during full test suite"
                elif t2_status == "TIMEOUT":
                    result_status = "TIMEOUT"
                    output_summary = "Timed out during full test suite"
                else:
                    result_status = "SURVIVED"
                    output_summary = "Survived all tests (targeted test and full suite passed)"

    finally:
        # Atomic rollback
        with open(target_file, "w", encoding="utf-8") as f:
            f.write(original_content)
        if os.path.exists(backup_file):
            os.remove(backup_file)
        active_mutation = None

        is_clean, diff_err = verify_git_clean(target_file)
        if not is_clean:
            raise RuntimeError(f"FATAL INTEGRITY VIOLATION: {target_file} not clean after rollback!\n{diff_err}")

    return {
        "id": mutant_id,
        "category": mutant.get("category", "UNKNOWN"),
        "service": mutant.get("service", "UNKNOWN"),
        "method": mutant.get("method", "UNKNOWN"),
        "target_file": mutant.get("target_file"),
        "target_test_class": target_test_class,
        "description": mutant.get("description", ""),
        "status": result_status,
        "killed_by": killed_by,
        "elapsed": round(total_elapsed, 2),
        "summary": output_summary
    }


def generate_reports(results, start_time, end_time):
    total_mutants = len(results)
    killed = sum(1 for r in results if r["status"] == "KILLED")
    survived = sum(1 for r in results if r["status"] == "SURVIVED")
    compilation_errors = sum(1 for r in results if r["status"] == "COMPILATION_ERROR")
    timeouts = sum(1 for r in results if r["status"] == "TIMEOUT")
    other_errors = sum(1 for r in results if r["status"] not in ("KILLED", "SURVIVED", "COMPILATION_ERROR", "TIMEOUT"))

    valid_mutants = killed + survived
    mutation_score = (killed / valid_mutants * 100.0) if valid_mutants > 0 else 0.0

    report_data = {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "total_time_seconds": round(end_time - start_time, 2),
        "total_mutants": total_mutants,
        "killed": killed,
        "survived": survived,
        "compilation_errors": compilation_errors,
        "timeouts": timeouts,
        "other_errors": other_errors,
        "mutation_score_percent": round(mutation_score, 2),
        "mutants": results
    }

    os.makedirs(os.path.dirname(REPORT_JSON_PATH), exist_ok=True)
    with open(REPORT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)

    md_content = f"""# INFORME DE TESTING DE MUTACIÓN AD-HOC (FASE 25)
## Suite de Mutación sobre Operaciones Transaccionales del Backend

- **Fecha de Ejecución:** `{report_data['timestamp']}`
- **Duración Total:** `{report_data['total_time_seconds']} s`
- **Total Mutantes Evaluados:** `{total_mutants}`
- **Mutantes Abatidos (Killed):** `{killed}`
- **Mutantes Supervivientes (Survived):** `{survived}`
- **Errores de Compilación:** `{compilation_errors}`
- **Timeouts:** `{timeouts}`
- **Mutation Score Final:** `{"100.0%" if mutation_score == 100.0 else f"{mutation_score:.1f}%"}`

---

## 1. Resumen por Categoría

| Categoría | Total | Abatidos | Supervivientes | Score |
| :--- | :---: | :---: | :---: | :---: |
"""

    categories = sorted(list(set(r.get("category", "UNKNOWN") for r in results)))
    for cat in categories:
        cat_results = [r for r in results if r.get("category") == cat]
        cat_k = sum(1 for r in cat_results if r["status"] == "KILLED")
        cat_s = sum(1 for r in cat_results if r["status"] == "SURVIVED")
        cat_valid = cat_k + cat_s
        cat_score = (cat_k / cat_valid * 100.0) if cat_valid > 0 else 0.0
        md_content += f"| `{cat}` | {len(cat_results)} | {cat_k} | {cat_s} | **{cat_score:.1f}%** |\n"

    md_content += """
---

## 2. Detalle Exhaustivo de Mutantes Sintéticos

| ID | Categoría | Servicio / Método | Test Objetivo | Estado | Abatido Por | Tiempo (s) | Descripción |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
"""

    for r in results:
        status_badge = f"**{r['status']}**" if r['status'] == "KILLED" else f"❌ `{r['status']}`"
        killed_info = r.get("killed_by") or "-"
        md_content += f"| `{r['id']}` | `{r.get('category', '-')}` | `{r.get('service', '-')}.{r.get('method', '-')}` | `{r.get('target_test_class', '-')}` | {status_badge} | `{killed_info}` | {r.get('elapsed', 0)} | {r.get('description', '')} |\n"

    md_content += """
---

## 3. Conclusión de Integridad y Blindaje
"""
    if mutation_score == 100.0 and survived == 0:
        md_content += """
> **ESTADO: APROBADO AL 100% (MUTATION SCORE = 100%)**  
> Todos los mutantes sintéticos inyectados en las operaciones transaccionales críticas del backend fueron efectivamente detectados y abatidos por las pruebas unitarias. Cero mutantes supervivientes. El código productivo en `backend/src/main/` permanece 100% íntegro e inalterado.
"""
    else:
        md_content += f"""
> **ESTADO: MUTANTES SUPERVIVIENTES DETECTADOS ({survived} supervivientes)**  
> Se requiere fortalecer la suite de pruebas unitarias para abatir los mutantes supervivientes y alcanzar el 100% de Mutation Score.
"""

    with open(REPORT_MD_PATH, "w", encoding="utf-8") as f:
        f.write(md_content)

    return report_data


def main():
    parser = argparse.ArgumentParser(description="Ad-Hoc Mutation Testing Runner")
    parser.add_argument("--catalog", default=DEFAULT_CATALOG_PATH, help="Path to mutants catalog JSON")
    parser.add_argument("--mutant", help="Execute single mutant by ID")
    parser.add_argument("--category", help="Execute mutants for specific category")
    parser.add_argument("--dry-run", action="store_true", help="Validate catalog syntax without executing tests")
    parser.add_argument("--skip-full-suite", action="store_true", help="Skip full suite run if targeted test passes")
    parser.add_argument("--verbose", action="store_true", help="Print detailed Maven output")
    args = parser.parse_args()

    print("=" * 80)
    print("CLINICA DERMATOLOGICA - AD-HOC MUTATION TESTING RUNNER (FASE 25)")
    print("=" * 80)
    print(f"Project root : {PROJECT_ROOT}")
    print(f"Backend dir  : {BACKEND_DIR}")
    print(f"Java Home    : {JAVA_HOME}")
    print(f"Catalog      : {args.catalog}")

    if not os.path.exists(args.catalog):
        print(f"Error: Catalog not found at {args.catalog}", file=sys.stderr)
        sys.exit(1)

    with open(args.catalog, "r", encoding="utf-8") as f:
        mutants = json.load(f)

    if args.mutant:
        mutants = [m for m in mutants if m["id"] == args.mutant]
        if not mutants:
            print(f"Error: Mutant ID '{args.mutant}' not found in catalog.", file=sys.stderr)
            sys.exit(1)

    if args.category:
        mutants = [m for m in mutants if m.get("category") == args.category]
        if not mutants:
            print(f"Error: Category '{args.category}' matched no mutants.", file=sys.stderr)
            sys.exit(1)

    print(f"Total mutants selected for evaluation: {len(mutants)}")

    # Pre-flight git clean check on production code
    is_clean, diff_err = verify_git_clean(os.path.join(PROJECT_ROOT, "backend/src/main"))
    if not is_clean:
        print("Pre-flight check error: backend/src/main has uncommitted modifications:\n" + diff_err, file=sys.stderr)
        sys.exit(1)

    if args.dry_run:
        print("\n--- Running Dry-Run Catalog Validation ---")
        errors = 0
        for m in mutants:
            tf = os.path.join(PROJECT_ROOT, m["target_file"])
            if not os.path.exists(tf):
                print(f"[FAIL] {m['id']}: Target file {m['target_file']} does not exist")
                errors += 1
                continue
            with open(tf, "r", encoding="utf-8") as f:
                content = f.read()
            count = content.count(m["original_code"])
            if count == 0:
                print(f"[FAIL] {m['id']}: original_code pattern not found in {m['target_file']}")
                errors += 1
            elif count > 1:
                print(f"[FAIL] {m['id']}: original_code pattern not unique ({count} occurrences) in {m['target_file']}")
                errors += 1
            else:
                print(f"[OK]   {m['id']}: unique match in {m['target_file']}")
        print(f"\nDry run complete. Errors found: {errors}")
        sys.exit(errors)

    start_time = time.time()
    results = []

    print("\n--- Ingesting and Executing Mutants ---")
    for idx, m in enumerate(mutants, 1):
        mid = m["id"]
        srv = m.get("service", "")
        test_cls = m.get("target_test_class", "")
        desc = m.get("description", "")
        print(f"\n[{idx}/{len(mutants)}] Evaluating {mid} ({srv} -> {test_cls})")
        print(f"      Description: {desc}")

        res = execute_mutant(m, skip_full_suite=args.skip_full_suite, verbose=args.verbose)
        results.append(res)

        badge = "[KILLED] " if res["status"] == "KILLED" else f"[{res['status']}]"
        print(f"      Result: {badge} ({res['elapsed']}s) - {res['summary']}")

    end_time = time.time()

    report_data = generate_reports(results, start_time, end_time)

    print("\n" + "=" * 80)
    print("CAMPAIGN SUMMARY")
    print("=" * 80)
    print(f"Total Mutants Evaluated : {report_data['total_mutants']}")
    print(f"Mutants Killed          : {report_data['killed']}")
    print(f"Mutants Survived        : {report_data['survived']}")
    print(f"Compilation Errors      : {report_data['compilation_errors']}")
    print(f"Timeouts                : {report_data['timeouts']}")
    print(f"Final Mutation Score    : {report_data['mutation_score_percent']}%")
    print(f"JSON Report written to  : {REPORT_JSON_PATH}")
    print(f"Markdown Report         : {REPORT_MD_PATH}")
    print("=" * 80)

    if report_data["survived"] > 0:
        print(f"\nWARNING: {report_data['survived']} mutants survived. Additional tests needed to achieve 100% score.")
        sys.exit(2)
    elif report_data["compilation_errors"] > 0 or report_data["timeouts"] > 0:
        sys.exit(3)
    else:
        print("\nSUCCESS: 100% Mutation Score achieved! All mutants killed!")
        sys.exit(0)


if __name__ == "__main__":
    main()
