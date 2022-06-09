import express from "express"
import cors from "cors"
import creatures from "./api/creatures.route.js"

const app = express()

app.use(cors())
app.use(express.json())//Server can accept json in body of request

app.use("/api/v1/creatures", creatures)
app.use("*", (req, res) => res.status(404).json({error: "An error occured in the routing and the connection has failed"})) //*wildcard, if someone goes to a route not in our route file,return error

export default app 