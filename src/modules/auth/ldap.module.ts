import {ldapConstants} from "../../config/config.json"
import {authenticate} from 'ldap-authentication'

export class LDAPModule {
    private readonly _LDAP_SEARCH_BASE: string;
    private readonly _dnAttribute: string;
    private readonly _dnBase: string;
    private readonly _LDAP_OPTS: unknown;

    constructor() {
        this._dnAttribute = ldapConstants.dnAttribute;
        this._dnBase = ldapConstants.dnBase;
        this._LDAP_SEARCH_BASE = ldapConstants.searchBase;
        this._LDAP_OPTS = { url: ldapConstants.url, tlsOptions: { rejectUnauthorized: false } }
    }

    public async verify(username: string, password: string): Promise<boolean> {
        /* eslint-disable-next-line*/
        return new Promise(async (resolve) => {
            const options = {
                ldapOpts: this._LDAP_OPTS,
                userDn: this._dnAttribute + "=" + username + "," + this._dnBase,
                userPassword: password,
                userSearchBase: this._LDAP_SEARCH_BASE,
                username: username,
                starttls: true
            }

            try {
                await authenticate(options)
                resolve(true)
                return
            } catch (err) {
               console.log(err)
               resolve(false)
            }
        })
    }
}
