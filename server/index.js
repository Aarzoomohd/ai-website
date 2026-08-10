import express from "express"
import dotenv from "dotenv"
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import websiteRouter from "./routes/website.routes.js";
import billingRouter from "./routes/billing.routes.js";
import { stripeWebhook } from "./controllers/stripeWebhook.controller.js";


const app=express();

//stripe
app.post("/api/stripe/webhook",express.raw({type: "application/json"}),
stripeWebhook)

const port=process.env.PORT || 5000

app.use(express.json())     //req.body se jo aaye wo thk s aaye
app.use(cookieParser())   // cookies ke liye
app.use(cors({
  origin:"https://ai-website-1-o4ai.onrender.com",
  credentials: true
}))
app.use("/api/auth",authRouter)   //auth router main jo bhi url bnenge unke aage ye lag jayega
app.use("/api/user",userRouter)    //userRouter ke liye
app.use("/api/website",websiteRouter)  //website router
app.use("/api/billing",billingRouter) 


app.listen(port,()=>{
  console.log("server started")
   connectDb()
} )
