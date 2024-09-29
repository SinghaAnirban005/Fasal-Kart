import express from "express"

const app = express()

app.get('/', (req, res) => {
    res.send('My name is Anirban Singha')
})

app.listen(4000, () => {
    console.log('Succesfully listening on PORT 4000')
})