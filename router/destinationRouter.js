import {Router} from "express"
import {Worker, parentPort} from "node:worker_threads"
import { Site } from "../schema/site.js"
import FFModel from "../schema/floraANDfauna.js"
import storage from "node-persist"

await storage.init({
    dir : './persist'
})

const destinationRouter = Router()

async function insertIntoModel(ffrespflora,ffrespfauna,site_id,site_name){
    try{
        const ffnew = new FFModel({site_id,flora:ffrespflora,fauna:ffrespfauna})
        await ffnew.save()
        const lst = await storage.getItem('ALREADY_FETCHED') || []
        lst.push(site_name)
        await storage.setItem('ALREADY_FETCHED',lst)
        // ALREADY_FETCHED_.push(site_name)
        // console.log(ALREADY_FETCHED_);
        console.log('succesfully entered the data into ffmodel')
    }catch(e){
        console.error(e)
        throw Error(e)
    }
}

/*
 * This api fetches all the heritage sites on the sites.
 * Each fetch, fetches only 10 response per page.
 * */

destinationRouter.get('/getAllSites',async(req,res)=>{
    var per_page = 10,page= Math.max(0,req.query.page)
    try{
        const sites = await Site.find({}).select('category date_inscribed http_url id_number image_url region short_description site')
        .limit(per_page).skip(per_page*page)

        res.status(200).send(sites)
    }catch(e){
        console.error(`Error ${e}`);
        res.status(500).send(`Error : 500`)
    }
})

/* 
 * This api fetches data for a specific site using it's id and name.
 *
 * This uses worker thread in order to improve the response time since we are using 
 * Gemini API to fetch data that is not available in the current Database.
 *
 * Worker thread works when the data has been fethced by Gemini API to store it into database.
 * In order to not withold the response.
 * Mimicing Concurrent Processing.
 * */

destinationRouter.get('/getSite/:id',async(req,res)=>{
    const id = req.params.id
    const site_name = req.query.name
    let not_worker = false
    try{    
        let worker
        let ffresp
        let response 
        const lst = await storage.getItem('ALREADY_FETCHED') || [] 
        console.log(lst)
        if(lst.indexOf(site_name)<0){
            worker = new Worker("./worker/worker.js",{workerData:{site_name:site_name}})

            worker.on('message',(data)=>{
                response = data
                console.log(`Worker 1 completed`);
            })
            worker.on('error',(err)=>{
                console.log("Error Worker Thread",err);
                throw Error(e)
            })
            worker.on('online',()=>{
                console.log(`Worker executing...`);
            })

            worker.on('exit',()=>{
                ffresp = response 
                console.log(responseSend);
                ffresp = ffresp.replace(/^```json\s+|```$/g, "");
                ffresp = JSON.parse(ffresp)
                // workerFunctionPerformsInsertion(ffresp['flora'],ffresp['fauna'],id,site_name)
                setTimeout(()=>{
                    insertIntoModel(ffresp['flora'],ffresp['fauna'],id,site_name)
                },2000)
                res.status(200).json({responseSend,...ffresp})
            })

        }else{
            console.log("getting from database")
            ffresp = await FFModel.findOne({site_id:id}).select('flora fauna')
            ffresp = ffresp["_doc"]
            not_worker = true
        }
        console.log('fetching site');
        const site = await Site.findById(id).select('category date_inscribed http_url id_number image_url latitude longitude region short_description site states') 
        const siteDetails = site["_doc"]
        
        const responseSend = {
            ...siteDetails,
            ...ffresp
        }
        if(not_worker){
            res.status(200).send(responseSend)
        }
        
    }catch(e){
        console.error(`Error ${e}`);
        res.status(500).send(`Error : 500`)
    }
})

// Useful for TEST

// destinationRouter.get('/test',async(req,res)=>{
//     try{
//         const worker = new Worker("./worker/worker.js")
//         let response = ""
//         let workerFinished = false
//         // parentPort.emit('start')
//         worker.on('message',(data)=>{
//             response = data
//             workerFinished = true
//             console.log(data);
//             console.log(`Worker ${worker.threadId} completed`);
//         })
//         worker.on('error',(err)=>{
//             console.log("Error Worker Thread",err);
//         })
//         worker.on('online',()=>{
//             console.log(`Worker executing js`);
//         })
//         worker.on('exit',()=>{
//             res.status(200).send(response)
//         })
//         // console.log("Main thread doing work");
//         // console.log(JSON.parse(response));
//         // while(1){
//         //     if(workerFinished){
//         //         console.log(response);
//         //         break
//         //     }
//         // }
//         // res.status(200).send(response)

//     }catch(e){
//         console.error(`Error: ${e}`);
//     }
// })


export default destinationRouter
