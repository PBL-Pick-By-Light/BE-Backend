# Util
Contains some useful functions and variables.

## [util.module](../../src/modules/util/util.module.ts)
### printToConsole
Prints out any given debugging log if variable debug is set true. The variable debug can be activated or deactivated in file [config.json](../../src/config/config.json).
### fromJson
Converts a JSON object into a map. Used for mapping descriptions, names, etc. in multiple languages.

## [timer](../../src/controllers/timer.ts)
Holds functions and variables for sending turnOff-requests to Embedded Systems  automatically after the given duration in the turnOn-request. 
