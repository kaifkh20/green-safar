import {workerData,parentPort} from "node:worker_threads"
import FFModel from "../schema/floraANDfauna.js";
import { ALREADY_FETCHED_ } from "../router/destinationRouter.js";

async function insertIntoModel(){
    try{
        const ffnew = await new FFModel({site_id:workerData['site_id'],flora:workerData['ffrespflora'],fauna:workerData['ffrespfauna']}).save()
        ALREADY_FETCHED_.push(workerData['site_name'])
        console.log('succesfully entered the data into ffmodel')
    }catch(e){
        console.error(e)
        throw Error(e)
    }
}
console.log(workerData)
console.log(`reaching here worker1.js`)
let response 

(async()=> {
    response = await insertIntoModel()
    console.log(response);
    parentPort.postMessage(response)
})()