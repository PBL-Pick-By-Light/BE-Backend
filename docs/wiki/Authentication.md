# [Authentication](../../src/controllers/auth.controller.ts)
Connected to auth.router.

Example authentication requests can be found in [auth.http](../../src/tests/http/auth.http)

- **login**
This method is used for logging in, through the loginLDAP method or login.
    * Required attributes: `name` and `password`
    * Login-Functionality is described in [Miro Board](https://miro.com/app/board/uXjVOcHLzeA=/)
    * Uses LDAP-Server (LDAP attributes configured in [config.json](../../src/config/config.json))
    * If LDAP-Connection fails or if `disableLDAP` is set to `true`, local authentication is used
    * If successful, login returns LDAP-Token
- **logout**
This method is used for logging out.
- **register**
This method is used to register a new user, you get the id of the new user
    * Required parameters: `name`, `password`
    * Optional paramenters: `firstname`, `lastname`, `email`, `searchColor`, `language`
    * Password is encoded in [HashString](../../src/modules/auth/auth.module.ts)-Class
- **delete**
This method is used to delete the User (you have to send the ID with it) 
