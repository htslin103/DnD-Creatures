import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import CreaturesDAO from "./dao/creaturesDAO.js"
dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 7000 

MongoClient.connect(
    process.env.CREATURES_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true}
    )
    .catch(err => {
        console.error(err.stack)//log error
        process.exit(1)
    })
    .then(async client =>{
        await CreaturesDAO.injectDB(client) //this is how we get our initial reference to creatures collection in DB
        app.listen(port, () => { //start our web server
            console.log(`listening on port ${port}`)
        })
    })
