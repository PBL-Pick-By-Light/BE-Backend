import { debug } from '../../config/config.json'

export function printToConsole(s: any){
    if (debug == "true") {
        console.log(s)
    }
}

export function fromJson(obj: any) {
    let strMap = new Map<string, string>();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}