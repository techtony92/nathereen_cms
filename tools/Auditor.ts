import {writeFile, existsSync, mkdir, appendFile, type WriteFileOptions} from "node:fs";
import { StatusCallback } from "./queue";
import AuditorQueue from "./AuditorQueue";

type INFO = "INFO";
type WARN = "WARN";
type DEBUG = "DEBUG";
type ERROR = "ERROR";

type Levels = INFO | WARN | DEBUG | ERROR;

class AuditTrail{

    private level: Levels | undefined;
    private fileUrl:string| null;
    private fileName:string| null;
    private writeToFile:boolean;
    private format:string | null;
    
    private message:string;
    private time:string;
    private auditorQueue:AuditorQueue;
    constructor(level?: Levels){
        this.level = level ?? undefined;
        this.writeToFile = false;
        this.fileUrl = null;
        this.fileName = null;
        this.format = null;
        
        this.message = "";
        this.time = "";
        this.auditorQueue = new AuditorQueue();
    }

    createAuditor(level: Levels, writeToFile?:boolean, fileURL?:string, fileName?:string){
        this.level = level;
        this.fileUrl = fileURL ?? null;
        this.fileName = fileName ?? null;
        this.writeToFile = writeToFile ?? false;
        this.auditorQueue.setAuditor(this);
        if(fileURL && fileName) this.writeToFile = true;
    }
    private configureFormat(message:string, scope:string){

        this.message = `${this.level ?? 'INFO'} : ${scope} : ${this.time} \n${message} \n`
    }
    
    configureTime(){
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const AmPm = date.getHours() < 12 ? "AM" : "PM";
        this.time = `${month}-${day}-${year} ${hours}:${minutes}:${seconds}:${AmPm}`;
    }

  
    
    private logToConsole(message:string){
        process.stdout.write(`${message} \n`);
    }

    log(message:string, scope:string, optionalStatusCallback?:StatusCallback){
        this.configureTime();
        this.configureFormat(message, scope);
        this.auditorQueue.commit(this.message);

        this.validateDirectoryExistence(this.fileUrl as string, optionalStatusCallback);
        if(this.validateFileExistence(`${this.fileUrl}/${this.fileName}`)){
            this.auditorQueue.initiateQueue({filePath:this.fileUrl as string, auditFile:this.fileName as string, encoding:"utf8"},"APPEND", optionalStatusCallback);    
        }else{
            this.auditorQueue.initiateQueue({filePath:this.fileUrl as string, auditFile:this.fileName as string, encoding:"utf8"},"WRITE", optionalStatusCallback)
        }
       
        

    }

    DEBUG(message:string, scope:string, optionalStatusCallback?:StatusCallback){
        this.level = "DEBUG";
        this.log(message, scope, optionalStatusCallback);
    }
    INFO(message:string, scope:string, optionalStatusCallback?:StatusCallback){
        this.level = "INFO";
        this.log(message, scope, optionalStatusCallback);
    }
    WARN(message:string, scope:string, optionalStatusCallback?:StatusCallback){
        this.level = "WARN";
        this.log(message, scope, optionalStatusCallback);
    }
    ERROR(message:string, scope:string, optionalStatusCallback?:StatusCallback){
        this.level = "ERROR";
        this.log(message, scope, optionalStatusCallback);
    }

    

     write(filePath:string, message:string, encoding:WriteFileOptions, callback:(error:NodeJS.ErrnoException | null) => void){
        writeFile(filePath, message, encoding, callback);
    }

     append(filePath:string, message:string, encoding:WriteFileOptions, callback:(error:NodeJS.ErrnoException| null) => void){
        appendFile(filePath, message, encoding, callback);
    }

    validateDirectoryExistence(directoryPath:string, optionalStatusCallback?:StatusCallback){
        if(existsSync(directoryPath)) return;
        this.createDirectory(directoryPath);
        this.auditorQueue.initiateQueue({filePath:this.fileUrl as string, auditFile:this.fileName as string, encoding:"utf8"},"WRITE", optionalStatusCallback);

    }

    validateFileExistence(filePath:string){
        if(existsSync(filePath)) return true;
        return false;
    }

    private createDirectory(fileURL:string){
        mkdir(fileURL, {recursive:true}, (error, path) =>{
            if(error) return console.error(error)
            process.stdout.write(`directory ${fileURL} successfully created \n`);
        })
    }
    
    getProperties(){
        return {
            level:this.level,
            scope:__filename,
            time:this.time,
            messageQueue:this.auditorQueue.queue.map<string>((x) => this.auditorQueue.queue[this.auditorQueue.queue.indexOf(x)])
        } as const;
    }
}

export default AuditTrail;