# Docker

The docker configuration consists of two files:
* [Dockerfile](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/Dockerfile)
* [docker-compose.yml](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/docker-compose.yml)

The **Dockerfile** manages the workflow to start the node-express-server in a docker container.
A docker image can be build with a custom tag with the following command:
```sh
docker build -t <TAGNAME> .
```
The created image can be found with the command:
```sh
docker image ls
```
To run the created image, run the following command:
```sh
docker run <IMAGE_ID> --name <NAME>
```

The file **docker-compose.yml** contains two services that interact with each other:
* mongo service
* node service
In order to start all services defined in the yml-file, run the command:
```sh
docker-compose up --build --detach
```
Further instructions for building the project can be found in [Build Instructions](Build_Instructions).
