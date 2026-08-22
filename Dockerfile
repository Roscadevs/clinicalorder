# ===================================================================
# DOCKERFILE RAÍZ PARA DESPLIEGUE CONTINUO EN CLOUD (RAILWAY / RENDER)
# Monorepo: Compilación y ejecución del Backend Spring Boot (Java 17)
# ===================================================================

# --- ETAPA 1: Compilación de artefactos con Maven y Java 17 ---
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Copia de descriptores de dependencias y descarga offline
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copia del código fuente del backend y empaquetado del JAR ejecutable
COPY backend/src ./src
RUN mvn clean package -DskipTests

# --- ETAPA 2: Entorno Liviano y Seguro de Producción JRE 17 ---
FROM eclipse-temurin:17-jre
WORKDIR /app

# Creación de usuario sin privilegios root para cumplimiento de seguridad
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copia del artefacto JAR compilado desde la etapa anterior
COPY --from=builder /build/target/*.jar app.jar

# Asignación de permisos al usuario de aplicación
RUN chown -R appuser:appgroup /app
USER appuser

# Exposición del puerto estándar del contenedor
EXPOSE 8080

# Variables de entorno JVM y comando de inicio
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
