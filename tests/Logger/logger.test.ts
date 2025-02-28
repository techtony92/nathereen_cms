import {describe, test, expect} from "@jest/globals";
import AuditTrail from "../../tools/Auditor";
import { readFile, existsSync } from "node:fs";
import { Status } from "../../tools/queue";


describe("Auditor Operations", ()=>{
    const auditor = new AuditTrail();
    const auditDirectory = `${process.cwd()}/log`;
    const auditFile = "system.log";
    auditor.createAuditor("INFO", true, auditDirectory, auditFile);
    
    test("Should create a directory", ()=>{
        auditor.log("Audit Directory Test", __filename);

        expect(existsSync(auditDirectory)).toBe(true)
    })

    test("Should write message to a logFile", ()=>{
        const auditorMessage = "Audit Message \n";
        auditor.log(auditorMessage,__filename, (operationResult:Status)=>{
            expect(operationResult.status).toBe("success");
            expect(auditor.getProperties().messageQueue).toHaveLength(0);
        });
    })
    test("Should Log a message with status DEBUG", ()=>{
        const auditorMessage = "Audit Message: DEBUG \n";
        auditor.DEBUG(auditorMessage, __filename, (operationResult:Status)=>{
            expect(operationResult.status).toBe("success");
            expect(auditor.getProperties().level).toBe("DEBUG");
            expect(auditor.getProperties().messageQueue).toHaveLength(0);
        });
    })
    test("Should Log a message with status INFO", ()=>{
        const auditorMessage = "Audit Message: INFO \n";
        auditor.INFO(auditorMessage, __filename, (operationResult:Status)=>{
            expect(operationResult.status).toBe("success");
            expect(auditor.getProperties().level).toBe("INFO");
            expect(auditor.getProperties().messageQueue).toHaveLength(0);
        });
    })
    test("Should Log a message with status WARN", ()=>{
        const auditorMessage = "Audit Message: WARN \n";
        auditor.WARN(auditorMessage, __filename, (operationResult:Status)=>{
            expect(operationResult.status).toBe("success");
            expect(auditor.getProperties().level).toBe("WARN");
            expect(auditor.getProperties().messageQueue).toHaveLength(0);
        });
    })
    test("Should Log a message with status ERROR", ()=>{
        const auditorMessage = "Audit Message: ERROR \n";
        auditor.ERROR(auditorMessage, __filename, (operationResult:Status)=>{
            expect(operationResult.status).toBe("success");
            expect(auditor.getProperties().level).toBe("ERROR");
            expect(auditor.getProperties().messageQueue).toHaveLength(0);
        });
    })
})

