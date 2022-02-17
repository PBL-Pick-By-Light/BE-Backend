import {NextFunction} from "express";

/**
 * holds currently activated ids
 */
export let shiningId : string[] = []

/**
 * Calls a function after a timeout.
 * Intended to trigger turnOff for positions with given duration.
 * @param next
 * @param itemId
 * @param durationInSecounds
 */
export function timer(next: NextFunction, itemId: string, durationInSecounds: number){
    setTimeout(function removeShiningIdAndTurnOff(){
            if (itemId) {
                for (const id of shiningId) {
                    if (id == itemId) {
                       next();
                    }
                }
            }
        }
    , 1000*durationInSecounds)
}
