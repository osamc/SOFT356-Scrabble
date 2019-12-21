const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

const html = __dirname + '/soft356scrabble/dist/soft356scrabble/'


app.use(express.static(html));
app.use(cors());



app.get('/meme', (req, res) => res.send('Hello World!'));
app.get('/', (req, res) => {
    res.sendFile(html + 'index.html');
})







app.listen(port, () => console.log(`Example app listening on port ${port}!`))