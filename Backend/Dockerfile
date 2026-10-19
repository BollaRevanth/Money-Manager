# ==========================================
# STAGE 1: Build the Spring Boot .jar file
# ==========================================
FROM maven:3-eclipse-temurin-25-noble AS build
WORKDIR /app

# 1. Copy only pom.xml first and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copy your Java source code and build the executable .jar
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Create a lightweight runtime image
# ==========================================
FROM eclipse-temurin:25-jre-noble
WORKDIR /app

# Copy ONLY the compiled executable .jar file from Stage 1
COPY --from=build /app/target/moneymanager-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 and tune Java memory to fit inside Render's 512MB Free Tier limit
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx350m", "-Xms128m", "-jar", "app.jar"]