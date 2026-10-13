# Project: Testing de Mutación Ad-Hoc Transaccional y Fortalecimiento de Tests

## Architecture
- **Target Backend Core**: Spring Boot 3 + Java 17 + Spring Data JPA + Clean Architecture (`domain`, `application`, `infrastructure`, `presentation`).
- **Mutation Engine**: Harness automatizado ad-hoc en Python 3 (`scripts/mutation_runner.py`) con inyección temporal aislada en AST/código fuente, respaldo inmutable (`.original_bak`), ejecución de JUnit 5 vía Maven (`JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test`), clasificación rigurosa (KILLED / SURVIVED / TIMEOUT / COMPILATION_ERROR) y restauración atómica garantizada con git clean check.
- **Test Suite**: JUnit 5 + Mockito 5 (`@ExtendWith(MockitoExtension.class)`) + Spring Boot Test.
- **Invariants & Auditing**: Preservación estricta de `entrada_hc_audit`, `historia_clinica_audit`, columna de bloqueo optimista `@Version` en `cita`, y estándar RFC 7807.
- **Knowledge Graph**: Sincronización AST mediante `graphify update . && graphify export obsidian`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Mapeo de Impacto y Auditoría de Invariantes (Fase 1) | Mapeo de dependencias entre capas, servicios @Transactional y advertencias sobre clinical_entries_audit | M1 | Survey |
| 2 | Especificación Formal PRD Rivera (Fase 2) | Documento formal PRD_Fase_25_Testing_Mutacion_AdHoc_Transaccional.md en documentacion/historial_prds/ | M1 | Survey |
| 3 | Plan Técnico de Implementación (Fase 3) | Plan de arquitectura en documentacion/implementation_plan.md con diseño de mutantes, tests y runner | M2 | Survey |
| 4 | Runner Automatizado de Mutaciones (R3) | Script de inyección sintética, backup/restore seguro, ejecución Maven y reporte estructurado | M3 | R3 |
| 5 | Fortalecimiento de Pruebas Unitarias JUnit 5 (R4) | Tests unitarios para abatir mutantes supervivientes en MedicalRecord, Appointment, Payment, Auth, etc. | M4 | R4 |
| 6 | Ejecución de Mutación al 100% y Verificación de Invariantes (Fase 5) | Verificación de 100% mutantes abatidos, regresión limpia, auditoría de invariantes y actualización graphify | M5 | R1-R4 & Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Fase 1 & 2: PRD Rivera | Redacción del PRD formal de requerimientos en historial_prds | none | DONE |
| M2 | Fase 3: Technical Plan | Redacción de implementation_plan.md con arquitectura de mutación | M1 | DONE |
| M3 | Fase 4a: Mutation Runner Engine | Desarrollo del harness scripts/mutation_runner.py | M2 | DONE |
| M4 | Fase 4b: Test Hardening | Adición de tests JUnit 5 para abatir mutantes supervivientes | M2 | DONE |
| M5 | Fase 4c & 5: Full Run & Invariant Audit | Ejecución del 100% de mutantes abatidos, regresión y graphify update | M3, M4 | DONE |

## Interface Contracts
### Mutation Runner CLI ↔ Test Suite
- Script invocation: `python3 scripts/mutation_runner.py [--mutants-file scripts/mutants_catalog.json] [--target-service <Service>]`
- Maven invocation: `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test -Dtest=<TestClass>` (targeted) and `mvn test` (full regression)
- Return codes:
  * 0: Tests run, mutant killed (test failure indicates mutant kill) or clean restore
  * 1: Mutant survived (tests passed despite mutation) -> requires test hardening
- Mutation Catalog Schema: JSON array with `id`, `category`, `service`, `target_file`, `line_number`, `original_code`, `mutated_code`, `target_test_class`, `description`.

## Code Layout
- `backend/src/main/java/com/clinicadermatologica/app/application/service/`: Servicios transaccionales bajo prueba.
- `backend/src/test/java/com/clinicadermatologica/app/application/service/`: Pruebas unitarias JUnit 5 fortalecidas.
- `scripts/`: Harness de mutación (`mutation_runner.py`, `mutants_catalog.json`).
- `documentacion/historial_prds/`: PRD formal de Fase 25 (`PRD_Fase_25_Testing_Mutacion_AdHoc_Transaccional.md`).
- `documentacion/implementation_plan.md`: Plan técnico de Fase 3.
- `.agents/teamwork/`: Metadatos y reportes de orquestación.
