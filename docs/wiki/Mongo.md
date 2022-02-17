# Mongo

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
