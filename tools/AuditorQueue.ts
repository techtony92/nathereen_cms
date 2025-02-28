
import QUEUE from "./queue";
import type { LogArgs,  StatusCallback } from "./queue";
import AuditTrail from "./Auditor";
type WriteOperation = "APPEND" |"WRITE";
class AuditorQueue extends QUEUE{
    readonly queue: Array<string>;
    isProcessing: boolean;
    private auditor:AuditTrail|null;
    constructor(auditor?:AuditTrail){
        super();
        this.queue = [];
        this.isProcessing = false;
        this.auditor = auditor ?? null;
    }

    setAuditor(auditor:AuditTrail){
        this.auditor = auditor;
    }

    commit(message:string){
        this.queue.unshift(message);
    }

    initiateQueue(fileInfo:LogArgs, queueOperation:WriteOperation, optionalStatusCallback?:StatusCallback){
        this.processQueue(fileInfo, queueOperation, optionalStatusCallback);
    }

    processQueue(fileInfo:LogArgs, queueOperation:WriteOperation, optionalStatusCallback?:StatusCallback): string | undefined{
        if(this.isProcessing || this.queue.length === 0){
            
            if(this.queue.length === 0 && optionalStatusCallback){
                optionalStatusCallback({status:"success", message:"file written to successfully"});
            }
            return; 
        }

        if(!this.auditor) return `You need to set the auditor`;

        const {filePath, auditFile, encoding} = fileInfo;
        this.isProcessing = true;
        if(queueOperation === "WRITE"){
            this.auditor.write(`${filePath}/${auditFile}`, this.queue[this.queue.length - 1], encoding, ((error:NodeJS.ErrnoException|null)=>{
                if(error){
                    console.error(error);
                    throw new Error(error.message);
                }
                this.queue.pop();
                this.isProcessing = false;
                this.processQueue(fileInfo, "APPEND");
            })); 
        }else{
             this.auditor.append(`${filePath}/${auditFile}`, this.queue[this.queue.length - 1], encoding, (error: NodeJS.ErrnoException|null)=>{
             if(error){
                console.error(error);
                throw new Error(error.message);
             }
             this.queue.pop();
             this.isProcessing = false;
             this.processQueue(fileInfo, "APPEND");
        })
        }
        return;
    }
}

export default AuditorQueue;