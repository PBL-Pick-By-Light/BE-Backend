
# Pbl Backend
Backend of the Pick-by-Light-System

## Introduction
### Pick By Light – What’s that?

Ever searched for items in a shelf? Tools or parts in a workshop organizer?

Pick By Light is a concept for helping people find things. The position of the currently desired object will be shown through visual signals.
This concept is used by logistic centers like storage buildings, but can also be used on a smaller scale.

This pick-by-light-project (alias pbl-project) is intended to enable people to build their own pick-by-light system – big or small and easily adaptable.

It was developed as a students project in the course “SWT-Projekt” at [Technische Hochschule Mittelhessen (THM)](https://www.thm.de/site/en/).

**Documentation** can be found in [Project Wiki](docs/wiki/Home.md)

## Technologies

+ **NodeJS** → The backend server is a NodeJS server.
+ **MongoDB** → The database in which the application's data is organized is a MongoDB database.
+ **Mongoose** → The schema-based technology Mongoose is used in order to provide an easy way to handle data within the database.
+ **Chai** → Automatic testing is realized through the testing framework Chai.
+ **LDAP** → Supports authorization via LDAP-Server (but authorization via backend without LDAP is also possible).

## Project setup

```
cd pbl-backend
npm install
```

### Compiles and reloads automatically when files change
```
npm run dev
```

### Runs project in production mode
```
npm run start
```

### Compiles only
```
npm run build
```

### Start mongo and node server
```
NODE_ENV=docker_dev docker-compose up --build --detach
```

### Stop mongo and node server
```
docker-compose down
```

## Configuration

### Config variables

Defined in [config](src/config/config.json)

+ debug → if set true debugging logs will be printed

Defined in [default](config/default.json), [docker_dev](config/docker_dev.json), [docker_prod](config/docker_prod.json) and [test](config/test.json)

+ disableAuth → if set true any authorization functionality will be turned off - used for testing and development only!
+ disableLDAP → if set true only local authentication is used!

### Config constants

Defined in [constants](src/config/constants.ts)

+ jwtkey
    → JWT stands for **json web token** and is a standardized acces token, which secures data between two parties.
    → An implementation of JWT can be found at [https://jwt.io/](https://jwt.io/).
    → The jwt key defined in config constants is used to sign and verify the payload in the files (see [auth.controller.ts](src/controllers/auth.controller.ts) and [auth.module.ts](src/modules/auth/auth.module.ts))

+ expirationTime → time until jwtkey expires
+ requiredLangs → languages that are required ("en" as English, "de" as German)

## Tests
Make sure your testing database is empty.
Execute tests defined in [tests](src/tests/testdata)
```
NODE_ENV=test npm run test
``` 

### Add test data to Mongo Database
In case you might want to use test data add test data from json-Files [tests](src/tests/testdata) into mongo database
```
npm run addData
```

### Remove all data from Mongo Database
```
npm run removeData
```


## Problems

For some pcs the docker startup needs some extra commands.
Try
```
systemctl start docker
```
before doing anything else and add sudo when starting the mongo server
```
sudo NODE_ENV=docker_dev docker-compose up --build --detach
```
