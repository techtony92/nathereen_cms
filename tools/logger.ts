import winston from "winston";
import {readFile, writeFile, existsSync, mkdir, appendFile, close, constants} from "fs";


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
    private scope:string;
    private message:string;
    private time:string;
    constructor(level?: Levels){
        this.level = level ?? undefined;
        this.writeToFile = false;
        this.fileUrl = null;
        this.fileName = null;
        this.format = null;
        this.scope = "";
        this.message = "";
        this.time = "";
    }

    /*
    * @param level: log level : LogLevel
    * @param writeToFile: sets whether to write to a file.
    *  Automatically set to true if both file name and file path are provided.
    * @param fileURL: directory of the file: string
    * @param fileName:name of the file:string
    * @param scope: The file that this message was invoked from. 
    */
    createAuditor(level: Levels, writeToFile?:boolean, fileURL?:string, fileName?:string, scope?:string){
        this.level = level;
        this.fileUrl = fileURL ?? null;
        this.fileName = fileName ?? null;
        this.writeToFile = writeToFile ?? false;
        this.scope = scope ?? "";
        if(fileURL && fileName) this.writeToFile = true;
    }
    private configureFormat(message:string){
        /*
        * 
        * LEVEL SCOPE : DATE - TIME : 
        * -> Message
        *
        * */
        this.message = message;
        this.format = `${this.level ?? 'INFO'} : ${this.scope} : ${this.time} \n ${message} \n`
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

    private logToFile(message:string){
        if(existsSync(`${this.fileUrl}/${this.fileName}`)){
            this.checkWrittenToStatus((status) =>{
                console.log(status);
                if(status){
                         appendFile(`${this.fileUrl}/${this.fileName}`, message,  (error) => {
                            console.log(error);
                            if(error) throw Error(error.message);
                        })
                }else{
                        writeFile(`${this.fileUrl}/${this.fileName}`,message, "utf-8", (error)=>{
                            if(error) throw new Error(error.message);
                        })
                }
            })

        }else{
            console.log("writting new file");
            writeFile(`${this.fileUrl}/${this.fileName}`,message, "utf-8", (error)=>{
                if(error) throw new Error(error.message);
            });
        }
        // if(this.checkWrittenToStatus()){
            
        // }else{
            
        // }
    }
    
    private logToConsole(message:string){
        process.stdout.write(`${message} \n`);
    }

    log(message:string){
        this.configureTime();
        this.configureFormat(message);
        const logMessage = `${this.format}`;
        if(this.writeToFile){
            console.log(this.fileUrl);
            if(this.checkExists(this.fileUrl as string)){
                this.logToFile(logMessage);
            }else{
                this.createDirectory(this.fileUrl as string);
                this.logToFile(logMessage);
            }
        }else{
            this.logToConsole(logMessage);
        }
    }

    private checkWrittenToStatus(readyWriteOperation:(status:boolean) => void){

        readFile(`${this.fileUrl}/${this.fileName}`,"utf-8", (error, data) =>{
            if(error) throw new Error(error.message);
            if(data.length > 0 && data !== ""){
                readyWriteOperation(true);
            }else{
                readyWriteOperation(false); 
            }
        })
    }

    private checkExists(dirPath:string):boolean{
        let exists = false;
        
        if(existsSync(dirPath)){
            exists = true;
        }else{
            exists = false;
        }
        console.log(exists);
        return exists
    }

    private createDirectory(fileURL:string){
        mkdir(fileURL, {recursive:true}, (error, path) =>{
            if(error) return console.error(error)
            process.stdout.write(`directory ${fileURL} successfully created \n`);
        })
    }
    
    getTime(){
        return this.time;
    }
    getScope(){
        return this.scope;
    }
    getLevel(){
        return this.level;
    }
    getProperties(){
        return {
            level:this.level,
        }
    }
}
// function createLogger({level, filePath, fileName, format}:Logger):winston.Logger{
    
//     return winston.createLogger({
//         level:level,
//         format:  winston.format.timestamp(),
//         transports: [
//             new winston.transports.Console(),
//             new winston.transports.File({ filename: `${filePath}/${fileName}` , level:level}),
//         ]
//     })
// }

export default AuditTrail;