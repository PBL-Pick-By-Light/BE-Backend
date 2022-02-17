[Swagger](https://swagger.io/tools/swagger-ui/) is a REST API Documentation tool that visualizes the API's resouces.
It's implemented as a interactive and well-structured website.
Swagger is configured in json-files.

In our project, the documentation files can be found in the [swagger](https://github.com/PBL-Pick-By-Light/BE-Backend/tree/main/docs/swagger)-directory.
All top-level-routes are separated into different directories.
The top-level-json-file is: [swagger.json](https://github.com/PBL-Pick-By-Light/BE-Backend/-/blob/development/docs/swagger/swagger.json).

To start the swagger-server locally in a docker container, change into the swagger directory and run the following script:
```sh
cd docs/swagger
./startup.sh
```

