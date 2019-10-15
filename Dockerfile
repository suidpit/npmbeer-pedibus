FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG  JAR_FILE=pedibus-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
COPY init.json init.json
COPY reservations.json reservations.json
COPY user_init.json user_init.json
COPY shifts.json shifts.json
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
