# ================================
# 1) BUILD STAGE
# ================================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy file cấu hình Maven
COPY pom.xml .

# Copy source code
COPY src ./src

# Build JAR (bỏ test cho nhanh)
RUN mvn clean package -DskipTests


# ================================
# 2) RUN STAGE
# ================================
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy file JAR từ stage build
COPY --from=build /app/target/*.jar app.jar

# Render sẽ truyền PORT runtime, mình expose theo nó
ENV PORT=8080
EXPOSE 8080

# Chạy Spring Boot
CMD ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
