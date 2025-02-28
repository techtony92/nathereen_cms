import {type WriteFileOptions, } from "node:fs";
export interface LogArgs {
    filePath:string,
    auditFile:string;
    encoding:WriteFileOptions 
} 

export interface Status {
    status:"success"|"error",
    message:string;
}
export type StatusCallback = (operationStatus:Status) => undefined
interface Queue{
    readonly queue:Array<string>;
    isProcessing:boolean;
    processQueue:(fileInfo?:unknown) => void;
}
class QUEUE implements Queue{
     queue:Array<string>;
     isProcessing:boolean;
    constructor(){
        this.queue = [];
        this.isProcessing = false;
    }

    processQueue(fileInfo?:unknown, queueOperation?:unknown, optionalStatusCallback?:StatusCallback):void{
        return;
    };

}

export default QUEUE;