# Util
Contains some useful functions and variables.

## [util.module](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/src/modules/util/util.module.ts)
### printToConsole
Prints out any given debugging log if variable debug is set true. The variable debug can be activated or deactivated in file [config.json](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/src/config/config.json).
### fromJson
Converts a JSON object into a map. Used for mapping descriptions, names, etc. in multiple languages.

## [timer](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/src/controllers/timer.ts)
Holds functions and variables for sending turnOff-requests to Embedded Systems  automatically after the given duration in the turnOn-request. 
