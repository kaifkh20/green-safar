import {Router} from "express"
import { log } from "node:console"
import {Worker, parentPort} from "node:worker_threads"
import { Site } from "../schema/site.js"

const destinationRouter = Router()


// Access your API key as an environment variable (see "Set up your API key" above)


destinationRouter.get('/getAllSites',async(req,res)=>{
    const sites = await Site.find({}) 
    res.status(200).send(sites)
})

destinationRouter.get('/getSite/:id',async(req,res)=>{

})

destinationRouter.get('/test',async(req,res)=>{
    try{
        const worker = new Worker("./worker/worker.js")
        let response = ""
        let workerFinished = false
        // parentPort.emit('start')
        worker.on('message',(data)=>{
            response = data
            workerFinished = true
            console.log(data);
            console.log(`Worker ${worker.threadId} completed`);
        })
        worker.on('error',(err)=>{
            console.log("Error Worker Thread",err);
        })
        worker.on('online',()=>{
            console.log(`Worker executing js`);
        })
        worker.on('exit',()=>{
            res.status(200).send(response)
        })
        console.log("Main thread doing work");
        console.log(response);
        // while(1){
        //     if(workerFinished){
        //         console.log(response);
        //         break
        //     }
        // }
        // res.status(200).send(response)

    }catch(e){
        console.error(`Error: ${e}`);
    }
})


export default destinationRouter
