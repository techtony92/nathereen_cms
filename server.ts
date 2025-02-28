import server from "./serverConfiguration";
import AuditTrail from "./tools/Auditor";
const PORT = process.env.PORT || 4500;
const auditDirectory = `${process.cwd()}/log/server`;
const serverAudit = "server.log";
const serverAuditor = new AuditTrail();
serverAuditor.createAuditor("INFO", true, auditDirectory, serverAudit);

server.listen(PORT, ()=>{
    console.log(`Server Listening on PORT ${PORT}`);
    serverAuditor.INFO(`Server Listening on PORT ${PORT}`, __filename);
})
