# ==========================================
# STAGE 1: Build de la aplicación con Maven
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copia el archivo de dependencias para aprovechar la caché de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia el código fuente y compila el paquete JAR omitiendo tests en build de contenedor
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# STAGE 2: Imagen de ejecución ligera JRE
# ==========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crea usuario no root por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia el JAR generado desde el Stage 1
COPY --from=builder /build/target/*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

# Puerto expuesto por Spring Boot
EXPOSE 8080

# Variables de entorno por defecto
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
