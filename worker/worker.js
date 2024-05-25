import {parentPort,workerData} from "node:worker_threads"
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { response } from "express";
import dotenv from "dotenv"
dotenv.config()


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

async function fetchGeminiApi() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = `Floura and founa of ${workerData.site_name}.Give me back data in json format only no extra answer do not use code highlighting.Format of the data should not include description but only flora and in it should be array of names same for fauna object too.Limit the flora and fauna to 10 only`

  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = response.text()
  return text
}
console.log(workerData);
console.log("reaching here worker.js");

let response 

(async()=> {
    response = await fetchGeminiApi()
    // console.log(response);
    parentPort.postMessage(response)
})()

// console.log(response);

// parentPort.postMessage(response)