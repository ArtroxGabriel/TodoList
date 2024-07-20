import express, { Express } from "express";
import { PORT } from "./config";
import router from "./routes";

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

router(app)

app.listen(PORT, () => { console.log(`Express running in ${PORT} port`) })
