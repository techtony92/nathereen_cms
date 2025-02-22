import server from "./serverConfiguration";
const PORT = process.env.PORT || 4500;



server.listen(PORT, ()=>{
    console.log(`Server Listening on PORT ${PORT}`);
})
