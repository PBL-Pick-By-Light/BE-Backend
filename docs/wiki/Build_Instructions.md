# Build instructions

Clone git repository
```
git clone https://github.com/PBL-Pick-By-Light/BE-Backend.git
```
## Local Build
**Step 1:**
Install all required node dependencies listed in [package.json](../../package.json) to local system and run server locally.

```
cd pbl-backend
npm install
```

Create and run Mongo database in docker
See [Mongo Documentation](Mongo.md)

**Step 3:**
Start project described in 1a-c
#### 1a. Run project in development mode:
Server restarts automatically when file changes are observed
```
npm run dev
```

#### 1b. Run project in production mode:
Run Server without automatic restarting
```
npm run start
```

#### 1c. Only build project:
Compile typescript source into javscript
```
npm run build
```

## Full Docker
Note: Make sure you have root rights when working with docker on Ubuntu. (sudo)

#### Start mongo and node server
Setting NODE_ENV to 'docker_dev' to run docker in development mode
in develompent mode disableAuth is set to 'true'
```
NODE_ENV=docker_dev docker-compose up --build --detach
```

Setting NODE_ENV to 'docker_prod' to run docker in production mode
```
NODE_ENV=docker_prod docker-compose up --build --detach
```


#### Stop mongo and node server 
```
docker-compose down
```
