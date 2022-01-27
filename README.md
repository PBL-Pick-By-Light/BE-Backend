# Pbl Backend

Backend of the Pick-by-Light-System

## Table of contents
  * [Build instructions](#build-instructions)
  * [Mongo Database](#mongo-database)
  * [Run tests](#run-tests)

## Build instructions
Clone git repository
```
git clone git@git.thm.de:softwaretechnik-projekt-pick-by-light-system-wise21_22/pbl-backend/pbl-backend.git
```
### Option 1: Local build (+Mongo Database in Docker Container)
**Step 1:**
Install all required node dependencies listed in [package.json](./package.json) to local system and run server locally.

```
cd pbl-backend
npm install
```

Create and run Mongo database in docker
See [description](#mongo-database)


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

### Option 2: Full docker
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

## Mongo Database

#### Start Mongo Docker Container
If mongodb container exists and isn`t started yet
```
sudo docker start mongodb
```

If mongodb container does not exist
```
sudo docker run -dit --name mongodb -p 27017:27017 mongo
```

#### Stop Mongo Docker Container

```
sudo docker stop mongodb
```
#### Connect to Mongo Shell

Command `mongosh` is executed in container
```
sudo docker exec -it mongodb mongosh
```
After connecting to container, move into Database (Database name defined in [config.json](./src/config/config.json)):
```
use pblBackendDb
```
Example query: Show all items
```
db.items.find()
```

#### Add test data to Mongo Database
Add test data from json-Files [tests](src/tests/testdata) into mongo database
```
npm run addData
```

#### Remove all data from Mongo Database
```
npm run removeData
```

## Tests
Make sure your testing database is empty.
Execute tests defined in [tests](src/tests/testdata)
```
NODE_ENV=test npm run test
``` 
