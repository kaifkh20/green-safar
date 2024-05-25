import {parentPort, workerData} from "node:worker_threads"
parentPort.postMessage(workerData.num * workerData.num)