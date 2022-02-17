# Routes

Routes for requests organized by concerning entity. For most entities there are get, create, update and delete routes. Some, like settings do have intentionally less routes.

See all routes via [Swagger](../../docs/swagger).
View by 
- starting docker

```
systemctl start docker
```

```
sudo ENV=docker_dev docker-compose up --build --detach
```
- navigate to pbl-backend/docs/swagger
- start swagger

```
sudo ./startup.sh
```

- enter into your browser

```
http://localhost:8081/pbl-backend/swagger
```
