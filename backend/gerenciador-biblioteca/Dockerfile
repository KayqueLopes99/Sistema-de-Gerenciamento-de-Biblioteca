# ==========================================
# Estágio 1: Build (Compilação do projeto)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copia o pom.xml e baixa as dependências (ajuda no cache do Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código fonte e compila o .jar (ignorando os testes para ser mais rápido)
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Estágio 2: Run (Execução da aplicação)
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia apenas o .jar gerado no estágio anterior
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]