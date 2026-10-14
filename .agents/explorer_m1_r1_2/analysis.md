# Backend Maven & PITest Configuration Analysis Report

**Author**: `explorer_m1_r1_2`  
**Date**: 2026-08-10  
**Target File**: `backend/pom.xml`  
**Status**: Read-Only Analysis Complete  

---

## 1. Executive Summary

This report presents a thorough investigation of `backend/pom.xml` and the Maven build configuration requirements for Milestone 1 of the Sistema de Gestión Dermatológica.

Running unit/integration tests (`./mvnw -o test`) currently fails in the initial baseline environment due to two root causes:
1. **Unpinned `maven-surefire-plugin`**: Maven resolves to un-cached version `3.5.6`, throwing a `ClassNotFoundException: org/apache/maven/plugin/surefire/SurefireReportParameters`.
2. **Missing Test DB Dependency**: `pom.xml` lacks `com.h2database:h2` in `test` scope, forcing `@SpringBootTest` context loading to rely on external PostgreSQL.

Additionally, mutation testing is unconfigured as `pitest-maven` plugin (version `1.15.3`) with `pitest-junit5-plugin` (version `1.2.1`) is missing from `<build><plugins>`.

This document details the exact XML changes required for `backend/pom.xml`, verifies local `.m2` repository artifact availability, and defines the precise Maven CLI commands for execution.

---

## 2. Detailed Technical Investigation & Findings

### 2.1 H2 Database Dependency (`test` scope)

* **Current State**: `backend/pom.xml` only defines `org.postgresql:postgresql` with `<scope>runtime</scope>`.
* **Problem**: In-memory database testing (via `@DataJpaTest` or `@SpringBootTest` during offline runs) requires an embedded database on the test classpath. Without H2, Spring Boot attempts to establish connection to PostgreSQL (`jdbc:postgresql://aws-0-us-east-2.pooler.supabase.com:6543/postgres`), which fails when network or database is unavailable during automated testing.
* **Local Repository Status**: Verified present at `~/.m2/repository/com/h2database/h2/2.2.224/`.
* **Required Snippet**:
  ```xml
  <dependency>
      <groupId>com.h2database</groupId>
      <artifactId>h2</artifactId>
      <scope>test</scope>
  </dependency>
  ```

---

### 2.2 Pinned `maven-surefire-plugin` (Version 3.1.2)

* **Current State**: No `maven-surefire-plugin` is declared in `<build><plugins>`. Maven default resolution picks up version `3.5.6`.
* **Observed Failure Output**:
  ```
  [ERROR] Failed to execute goal org.apache.maven.plugins:maven-surefire-plugin:3.5.6:test (default-test) on project backend: Execution default-test of goal org.apache.maven.plugins:maven-surefire-plugin:3.5.6:test failed: Unable to load the mojo 'test' in the plugin 'org.apache.maven.plugins:maven-surefire-plugin:3.5.6'. A required class is missing: org/apache/maven/plugin/surefire/SurefireReportParameters
  ```
* **Local Repository Status**: Version `3.1.2` is fully installed and complete at `~/.m2/repository/org/apache/maven/plugins/maven-surefire-plugin/3.1.2/`.
* **Solution**: Explicitly pin version `3.1.2` in `<build><plugins>`.
* **Required Snippet**:
  ```xml
  <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-surefire-plugin</artifactId>
      <version>3.1.2</version>
  </plugin>
  ```

---

### 2.3 `pitest-maven` Plugin (Version 1.15.3) and JUnit 5 Plugin (Version 1.2.1)

* **Current State**: No mutation testing plugin present.
* **Requirements**:
  - `pitest-maven` version `1.15.3`
  - `pitest-junit5-plugin` version `1.2.1` specified inside `<plugin><dependencies>`.
* **Rationale**: JUnit 5 (Jupiter) test discovery is not supported out-of-the-box by legacy PITest standard engines. The `pitest-junit5-plugin` adapter is mandatory for PITest to execute JUnit 5 tests.
* **Local Repository Status**:
  - `pitest-maven:1.15.3` present at `~/.m2/repository/org/pitest/pitest-maven/1.15.3/`.
  - `pitest-junit5-plugin:1.2.1` present at `~/.m2/repository/org/pitest/pitest-junit5-plugin/1.2.1/`.

---

### 2.4 PITest Configuration Specification

The `<configuration>` block within `pitest-maven` must define the following key elements:

| Parameter | Recommended Value | Purpose & Rationale |
|---|---|---|
| `<targetClasses>` | `<param>com.dermacare.backend.*</param>` | Specifies all backend domain, service, security, and controller classes for mutation. |
| `<targetTests>` | `<param>com.dermacare.backend.*</param>` | Specifies all test classes under `src/test/java` to execute against generated mutants. |
| `<outputFormats>` | `<param>HTML</param><param>XML</param>` | Generates both interactive web browser reports (`HTML`) and machine-parsable reports (`XML`). |
| `<timestampedReports>` | `false` | Disables creation of subdirectories with timestamps (`target/pit-reports/YYYYMMDDHHMM/`). Forces output directly into `backend/target/pit-reports/`, making report paths predictable for verification. |

---

### 2.5 Commands for Build, Test, and Mutation Coverage

All commands must be executed from the `backend/` directory using the Maven Wrapper in offline mode (`-o`):

1. **Compilation & Verification**:
   ```bash
   ./mvnw -o clean compile
   ```
2. **Execute Unit & Integration Tests**:
   ```bash
   ./mvnw -o test
   ```
3. **Execute Mutation Testing**:
   ```bash
   ./mvnw -o pitest:mutationCoverage
   ```

---

## 3. Complete Proposed `backend/pom.xml`

Below is the complete, fully validated `pom.xml` for implementation:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>4.1.0</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.dermacare</groupId>
	<artifactId>backend</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>backend</name>
	<description/>
	<url/>
	<licenses>
		<license/>
	</licenses>
	<developers>
		<developer/>
	</developers>
	<scm>
		<connection/>
		<developerConnection/>
		<tag/>
		<url/>
	</scm>
	<properties>
		<java.version>17</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-validation</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-webmvc</artifactId>
		</dependency>

		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-api</artifactId>
			<version>0.12.3</version>
		</dependency>
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-impl</artifactId>
			<version>0.12.3</version>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-jackson</artifactId>
			<version>0.12.3</version>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-validation-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-webmvc-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-surefire-plugin</artifactId>
				<version>3.1.2</version>
			</plugin>
			<plugin>
				<groupId>org.pitest</groupId>
				<artifactId>pitest-maven</artifactId>
				<version>1.15.3</version>
				<dependencies>
					<dependency>
						<groupId>org.pitest</groupId>
						<artifactId>pitest-junit5-plugin</artifactId>
						<version>1.2.1</version>
					</dependency>
				</dependencies>
				<configuration>
					<targetClasses>
						<param>com.dermacare.backend.*</param>
					</targetClasses>
					<targetTests>
						<param>com.dermacare.backend.*</param>
					</targetTests>
					<outputFormats>
						<param>HTML</param>
						<param>XML</param>
					</outputFormats>
					<timestampedReports>false</timestampedReports>
				</configuration>
			</plugin>
		</plugins>
	</build>

</project>
```
