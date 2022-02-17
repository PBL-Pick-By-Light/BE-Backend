
## [Authentication](https://github.com/PBL-Pick-By-Light/BE-Backend/-/blob/development/src/controllers/auth.controller.ts)
Connected to auth.router.

Example autentication requests can be found in [auth.http](https://github.com/PBL-Pick-By-Light/BE-Backend/-/blob/development/src/tests/http/auth.http)

- [login](Login)
This method is used for logging in, through the loginLDAP method or login.
    * Required attributes: `name` and `password`
    * Login-Functionality is described in [Miro Board](https://miro.com/app/board/uXjVOcHLzeA=/)
    * Uses LDAP-Server (LDAP attributes configured in [config.json](https://github.com/PBL-Pick-By-Light/BE-Backend/-/blob/development/src/config/config.json))
    * If LDAP-Connection fails or if `disableLDAP` is set to `true`, local authentication is used
    * If successful, login returns LDAP-Token
- [logout](Logout)
This method is used for logging out.
- [register](Register)
This method is used to register a new user, you get the id of the new user
    * Required parameters: `name`, `password`
    * Optional paramenters: `firstname`, `lastname`, `email`, `searchColor`, `language`
    * Password is encoded in [HashString](https://github.com/PBL-Pick-By-Light/BE-Backend/-/blob/development/src/modules/auth/auth.module.ts)-Class
- [delete](Delete)
This method is used to delete the User (you have to send the ID with it) 
