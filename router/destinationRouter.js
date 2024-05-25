import express from "express"
import { GoogleGenerativeAI } from "@google/generative-ai";

export const destinationRouter = express.Router()

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyAKNQpMCMvveFqpfTFqA9t2L1olZgz-oSU");

async function fetchGeminiApi() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = "Floura and founa of Ancient and Primeval Beech Forests of the Carpathians and Other Region.Give me json data only no extra answer"

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = JSON.parse(JSON.stringify(response.text()))

  return text
}

destinationRouter.get('/getAllSites',async(req,res)=>{

})

destinationRouter.get('/getSite/:id',async(req,res)=>{

})

destinationRouter.get('/test',async(req,res)=>{
    try{
        const text = await fetchGeminiApi()
        console.log("Reaching here:"+text);
        res.send(text)
    }catch(e){
        console.error(`ERROR: ${e}`);
        res.status(400).send("Error")
    }
})
