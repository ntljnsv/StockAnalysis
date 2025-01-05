FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/spring_backend.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
