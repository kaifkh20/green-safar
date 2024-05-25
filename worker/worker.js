import {parentPort} from "node:worker_threads"
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { response } from "express";
import dotenv from "dotenv"
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

async function fetchGeminiApi() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = "Floura and founa of Ancient and Primeval Beech Forests of the Carpathians and Other Region.Give me json data only no extra answer"

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = JSON.parse(JSON.stringify(response.text()))

  return text
}
console.log("reaching here worker.js");

let response 

(async()=> {
    response = await fetchGeminiApi()
    console.log(response);
    parentPort.postMessage(response)
})()

// console.log(response);

// parentPort.postMessage(response)