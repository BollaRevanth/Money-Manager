# ---------- Stage 1: build ----------
FROM maven:3-eclipse-temurin-25-noble AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Stage 2: runtime ----------
FROM eclipse-temurin:25-jre-noble
WORKDIR /app

RUN useradd --system --no-create-home appuser
COPY --from=build /app/target/moneymanager-0.0.1-SNAPSHOT.jar app.jar
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-Duser.timezone=Asia/Kolkata", "-XX:+UseSerialGC", "-Xmx350m", "-Xms128m", "-Xss512k", "-jar", "app.jar"]