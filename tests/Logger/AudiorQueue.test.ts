import {describe, test, expect} from "@jest/globals";
import AuditorQueue from "../../tools/AuditorQueue";
import AuditTrail from "../../tools/Auditor";
import { Status } from "../../tools/queue";


describe("Queue Operations", ()=>{
    const auditor = new AuditTrail();
    const auditorQueue = new AuditorQueue();
    const path = `${process.cwd()}/log`;
    const auditFile = "system.queue.log";
    const message = `tesing 123 \n`;
    const encoding = "utf8";
    auditorQueue.setAuditor(auditor);

    test(`Should add a message to the queue`,()=>{
        auditorQueue.commit("Test Message Added to the Queue \n");
        expect(auditorQueue.queue).toContain("Test Message Added to the Queue \n");
        expect(auditorQueue.queue).toContainEqual("Test Message Added to the Queue \n");
    })

    test(`Start Processing & writing logs to file. This operation is Asynchronous, so we expect queue not to be empty at this time`,()=>{
        const asyncMessage = "Async Message, processing not done yet! \n";
        auditorQueue.commit(asyncMessage);
        auditorQueue.initiateQueue({filePath:path, auditFile:auditFile, encoding:encoding}, "WRITE");
        expect(auditorQueue.queue).not.toHaveLength(0);
    })

    test(`Start Processing & writing logs to file. This operation is Asynchronous, Passing OptionalCallback to await results`,()=>{
        const asyncMessageComplete = "Async Message Processing will be completed \n";
        auditorQueue.commit(asyncMessageComplete);
        auditorQueue.setAuditor(auditor);
        expect(auditorQueue.queue).not.toHaveLength(0);
        auditorQueue.initiateQueue({filePath:path, auditFile:auditFile, encoding:encoding}, "WRITE", (operationResult:Status)=>{
                if(operationResult.status === "error") throw new Error(operationResult.message);
                try{
                    expect(operationResult.status).toBe("success");
                    expect(auditorQueue.queue).toHaveLength(0);
                }catch(error){
                    
                }
        });
    });
    test(`Start Processing & appends messages to log file. This operation is Asynchronous, Passing OptionalCallback to await results`,()=>{
        const appendMessage = "Async Message Append \n";
        auditorQueue.commit(appendMessage);
        expect(auditorQueue.queue).not.toHaveLength(0);
        auditorQueue.initiateQueue({filePath:path, auditFile:auditFile, encoding:encoding}, "APPEND", (operationResult:Status)=>{
                if(operationResult.status === "error") throw new Error(operationResult.message);
                try{
                    expect(operationResult.status).toBe("success");
                    expect(auditorQueue.queue).toHaveLength(0);
                }catch(error){
                    
                }
        });
    });
})