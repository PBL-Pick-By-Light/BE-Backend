# Configuration files

### Config variables

Defined in [config (src/config/config.json)](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/src/config/config.json)

+ debug → if set true debugging logs will be printed

Defined in [default (config/default.json)](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/config/default.json), [docker_dev (config/docker_dev.json)](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/config/docker_dev.json), [docker_prod (config/docker_prod.json)](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/config/docker_prod.json) and [test (config/test.json)](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/config/test.json)

+ disableAuth → if set true any authorization functionality will be turned off - used for testing and development only!

### [Config constants](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/src/config/constants.ts)

Defined in [constants (src/config/constants.ts)](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/src/config/constants.ts)

+ jwtkey
    * JWT stands for **json web token** and is a standardized acces token, which secures data between two parties.
    * An implementation of JWT can be found at [https://jwt.io/](https://jwt.io/).
    * The jwt key defined in config constants is used to sign and verify the payload in the files (see [auth.controller.ts](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/src/controllers/auth.controller.ts) and [auth.module.ts](https://github.com/PBL-Pick-By-Light/BE-Backend/blob/development/src/modules/auth/auth.module.ts))

+ expirationTime → time until jwtkey expires
+ requiredLangs → languages that are required ("en" as English, "de" as German)
