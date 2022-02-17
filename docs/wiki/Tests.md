# How to run tests
Make sure your testing database is empty.
Execute tests defined in [tests](src/tests/testdata)
```
NODE_ENV=test npm run test
``` 

[Test files:](https://github.com/PBL-Pick-By-Light/BE-Backend/tree/main/src/tests)
# [Chai](https://github.com/PBL-Pick-By-Light/BE-Backend/tree/main/src/tests/chai)
tests using the framework chai, which can be run using scripts.
# [http](https://github.com/PBL-Pick-By-Light/BE-Backend/tree/main/src/tests/http)
http-tests.
Start mongo and node server
```
NODE_ENV=docker_dev docker-compose up --build --detach
```
Start the server e.g. using
```
npm run start
```

To avoid duplicates first use
```
npm run removeData
```
and for backend tests
```
npm run addData
```
for tests involving embedded systems use
```
npm run addESData
```
before sending http-requests.

Always make sure you are using ids that exist in your database when using http tests.
You can copy-paste those ids from the console log scripts like addData create.

For ES Test: Make sure the ip-address of your testdata fits your ES-Server/Test-Server. Change the ip-address attribute in the room
entity created in function addESTestData() in [testdata.ts](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/src/tests/scripts/testdata.ts) if not.
# [scripts](https://github.com/PBL-Pick-By-Light/BE-Backend/tree/main/src/tests/scripts)
for adding and removing testdata as well as starting the tests.
Use 
```
npm run
```
to see all currently available scripts.
# [testdata](https://github.com/PBL-Pick-By-Light/BE-Backend/tree/main/src/tests/testdata)
Some basic testdata in JSON format.
