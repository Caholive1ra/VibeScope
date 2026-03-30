# Estágio de Build
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copia o pom.xml e faz o download das dependências (aproveita cache do Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código-fonte
COPY src ./src

# Executa o build (ignorando os testes foca no pacote final .jar)
RUN mvn clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia o arquivo .jar gerado no estágio anterior
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta que a aplicação vai rodar
EXPOSE 8080

# Comando para iniciar a aplicação Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
