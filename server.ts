import express, {Request, Response} from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4500;


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req:Request, res:Response ) =>{
    console.log(` @${req.ip} \n Date: ${new Date().getMonth()}/${new Date().getDate()}/${new Date().getFullYear()} Time: @${new Date().getHours()}-${new Date().getMinutes()}${new Date().getHours() < 12 ? `am`:`pm`}`);
        res.send({msg:"Request Working"});
})

app.listen(PORT, ()=>{
    console.log(`Server Listening on PORT ${PORT}`);
})


export default app;