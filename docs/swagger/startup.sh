#!/bin/bash
printf "Starting PBL-Backend Swagger service!\n";
currentDir=`pwd`;
echo "Mapping volume to $currentDir."
echo "Started!"
docker run -p 8081:8080 -e BASE_URL=/pbl-backend/swagger -e SWAGGER_JSON=/swagger/swagger.json -v "$currentDir":/swagger swaggerapi/swagger-ui &&
printf "PBL-Backend Swagger execution finished!";
