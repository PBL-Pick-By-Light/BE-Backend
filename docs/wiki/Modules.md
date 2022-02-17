# Modules

## [Authentication](../../src/modules/auth)
* [permissions.json](../../src/modules/auth/permissions.json) -> Permissions are based on URLs. The file permissions.json contains the correct URL for each role. A short overview over roles and permissions: ![permissions](uploads/9578befabd2441226ba355a5658c4f25/permissions.png).
* [auth.module.ts](../../src/modules/auth/auth.module.ts) -> User roles can be identified when sending requests by using the jwt and authentification headers.
* [ldap.module.ts](../../src/modules/auth/ldap.module.ts) -> Verifies users who have an LDAP-account.
* [index.ts](../../src/modules/auth/index.ts) -> Exports variables that are used to authenticate users.

## [Entities](../../src/modules/entities)
* [entity.module.ts](../../src/modules/entities/entity.module.ts) -> Parental module for all entities.
* [item.module.ts](../../src/modules/entities/item.module.ts), [label.module.ts](../../src/modules/entities/label.module.ts), [language.module.ts](../../src/modules/entities/language.module.ts), [position.module.ts](../../src/modules/entities/position.module.ts), [room.module.ts](../../src/modules/entities/room.module.ts), [settings.module.ts](../../src/modules/entities/settings.module.ts), [shelf.module.ts](../../src/modules/entities/shelf.module.ts), [user.module.ts](../../src/modules/entities/user.module.ts)  -> Provide functions for creating, reading, updating and deleting for each entity type (not all functions are needed and implemented for all entities).
## [Mongo](../../src/modules/mongo)
* [mongo.module.ts](../../src/modules/mongo/mongo.module.ts) -> Functions for interaction with database.
* [mongo.schemes.ts](../../src/modules/mongo/mongo.schemes.ts) -> Mongoose offers the possibility to use schemes for data to set restraints and types. These schemes have to fit the interfaces (see [models](https://github.com/PBL-Pick-By-Light/BE-Backend/wikis/Models)) that are used to handle each entity.

## [Util](../../src/modules/util)
* [util.module](../../src/modules/util/util.module.ts) -> printToConsole: Prints out any given debugging log if variable debug is set true. The variable debug can be activated or deactivated in file [config.json](../../src/config/config.json). 
                                                        -> fromJson: Converts a JSON object into a map. Used for mapping descriptions, names, etc. in multiple languages.
* [timer](../../src/controllers/timer.ts) -> Holds functions and variables for sending turnOff-requests to Embedded Systems automatically after the given duration in the turnOn-request.
