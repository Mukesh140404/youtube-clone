// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js";
import dns from "dns";

dotenv.config()
// Force public DNS
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Fix IPv6 issues
dns.setDefaultResultOrder("ipv4first");

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`)
    })
})
.catch((error)=>{
    console.error("MongoDB mainindex connect failed !!!",error)
})
