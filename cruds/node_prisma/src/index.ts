import express from "express";


const app = express()

const PORT = process.env.PORT || 3001

app.get('/', (_, res) => {
    res.send("Working")
})

app.listen(PORT, () => { console.log(`Express running in ${PORT} port`) })
