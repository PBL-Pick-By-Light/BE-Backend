import {NextFunction} from "express";

export let shiningId : string[] = []

export function timer(next: NextFunction, itemId: string, durationInSecounds: number){
    setTimeout(function removeShiningIdAndTurnOff(){
            if (itemId) {
                for (const id of shiningId) {
                    if (id) {
                       next();
                    }
                }
            }
        }
    , 1000*durationInSecounds)
}
