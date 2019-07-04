const https = require('https')
const express = require('express')
const fs = require('fs')
const app = express()

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  
})

https.createServer({
    key: fs.readFileSync('./resources/server.key'),
    cert: fs.readFileSync('./resources/server.cert')
    
  }, app).listen(3000, () => {
    console.log('Listening...')
  })
