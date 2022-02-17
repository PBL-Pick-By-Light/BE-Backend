# Build instructions

Clone git repository
```
git clone https://github.com/PBL-Pick-By-Light/BE-Backend.git
```

There are two options to build the project: Local Build **or** Full Docker.

## Local Build
**Step 1:**
Install all required node dependencies listed in [package.json](../../package.json) to local system and run server locally.

```
cd pbl-backend
npm install
```

**Step 2:**
Create and run Mongo database in docker
See [Mongo Documentation](Mongo.md)

**Step 3:**
Start project described in 3a-c
#### 3a. Run project in development mode:
Server restarts automatically when file changes are observed
```
npm run dev
```

#### 3b. Run project in production mode:
Run Server without automatic restarting
```
npm run start
```

#### 3c. Only build project:
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
