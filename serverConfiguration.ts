import express, {type Request, type Response, type Express} from "express";
import dotenv from "dotenv";

dotenv.config();

const server:Express = express();

server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.get("/", (req:Request, res:Response ) =>{
    console.log(` @${req.ip} \n Date: ${new Date().getMonth()}/${new Date().getDate()}/${new Date().getFullYear()} Time: @${new Date().getHours()}-${new Date().getMinutes()}${new Date().getHours() < 12 ? `am`:`pm`}`);
        res.send({msg:"Request Working"});
})

export default server;