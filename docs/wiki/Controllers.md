# [Controllers](../../src/controllers)
For handling all the http-Requests for a specific entity by checking for errors and if there are none, calling the fitting module. 

## [auth.controller](../../src/controllers/auth.controller.ts)
Controller for http requests regarding authentification.
Connected to auth.router.

## [crud.controller](../../src/controllers/crud.controller.ts) (abstract)
 Abstract controller that provides functionality of all controllers that implement this class correspond to the CRUD convention. (Crud: Create, Read, Update, Delete).

## [index](../../src/controllers/index.ts)
Contains all exports of this module.

## [item.controller](../../src/controllers/crud.controller.ts)
Controller for all items, providing all CRUD functionality for the item router using methods of item module.

## [label.controller](../../src/controllers/label.controller.ts)
Controller for all labels, providing all functionality e.g. (create, read, update, delete) for the label router using methods of label module.

## [language.controller](../../src/controllers/language.controller.ts)
Controller for all languages, providing all CRUD functionality for the language router using methods of language module.

## [light.controller](../../src/controllers/light.controller.ts)
This Controller controls the light routes.
It is an intermediary between Frontend and Embedded Systems.
Messages from Frontend need to be brought into a format which Embedded Systems can work with.
Also, there can be a need of adding some infos from DB before messaging Embedded Systems.
This Controller is NOT a crud-controller. The needed Messages are only turnOn/turnOff

## [position.controller](../../src/controllers/position.controller.ts)
Class for actions triggered on Position docs in the DB.
The functions are intended to be triggered via Router an therefore accept HTTP- Requests and Responses as parameter.

## [room.controller](../../src/controllers/room.controller.ts)
Controller for all rooms, providing all functionality e.g. (create, read, update, delete) for the room router using methods of room module.

## [settings.controller](../../src/controllers/settings.controller.ts)
Controller for settings of the Pick-By-Light-Projekt
THIS is NOT a CRUD-Controller.
To avoid conflicting settings there will never be more than one settings-doc in the database.

## [shelf.controller](../../src/controllers/shelf.controller.ts)
Class for actions triggered on Shelf docs in the DB.
The functions are intended to be triggered via Router and therefore accept HTTP- Requests and Responses as parameter.


## [user.controller](../../src/controllers/user.controller.ts)
Class for actions triggered on User docs in the DB.
The functions are intended to be triggered via Router an therefore accept HTTP- Requests and Responses as parameter.


