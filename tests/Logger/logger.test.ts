import {describe, it, expect} from "@jest/globals";
import AuditTrail from "../../tools/logger";
import { readFile } from "fs";

   
describe(`Logger Creation`, ()=>{
    const errorLog = "error.txt";
    const statusLog = "system.txt";
    const logDir = `${process.cwd()}/logs`;
    const outputTest = `Testing Log Writer`;
    const errorOutputTest = `Error Log Test`;
    const auditor = new AuditTrail();
    auditor.createAuditor("INFO", true, logDir, statusLog,`logger.test.ts`);
    it(`Should create a logger with level:info`,() =>{
       expect(auditor.getProperties()).toHaveProperty("level","INFO");
       
    })

    it(`should create an Error log with level:error`, ()=>{
        const errorAuditor = new AuditTrail("ERROR");
        auditor.createAuditor("ERROR", true, logDir, errorLog,`logger.test.ts`);
        expect(errorAuditor.getProperties()).toHaveProperty("level","ERROR");
        expect(errorAuditor.getProperties()).toMatchObject({level:"ERROR"});
    })
})

describe(`Writing Events to Logs`, ()=>{
   
    const statusLog = "system.txt";
    const logDir = `${process.cwd()}/logs`;
    const auditor = new AuditTrail();
    auditor.createAuditor("INFO", true, logDir, statusLog, `logger.test.ts`);
    auditor.log("Testing logWriter");
    const outputTest = `${auditor.getLevel()} : ${auditor.getScope()} : ${auditor.getTime()} \n Testing logWriter \n`;
    it(`Should Write Standard Logs To Status output`, () =>{
        readFile(`${logDir}/${statusLog}`, 'utf-8',(error, data) =>{
        if(error) throw new Error(error.message);
        expect(data).toBe("abc");
        
        })
    })
})


// describe(`Appends new logs to file`, () =>{
//     const statusLog = "system.txt";
//     const logDir = `${process.cwd()}/logs/`;
//     const auditor = new AuditTrail();
//     auditor.createAuditor("INFO", true, logDir, statusLog, `logger.test.ts`);
//     auditor.log("Testing appending");
//     const outputTest = `${auditor.getLevel()} : ${auditor.getScope()} : ${auditor.getTime()} \n Testing logWriter \n ${auditor.getLevel()} : ${auditor.getScope()} : ${auditor.getTime()} \n Testing appending \n`;
//     it("Should keep old content and write new content on the next line ", (done) =>{
//         readFile(`${logDir}/${statusLog}`, 'utf-8',(error, data) =>{
//             if(error) throw new Error(error.message);
//             expect(data).toBe("abc");
//             done();
            
//         });
        
//     })
// })