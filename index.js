const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs');
// create our express app
const app = express()
// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
// route
const routes = require('./routes/Routes')
app.use('/', routes)

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
  })
  
//start server
app.listen(3000, ()=>{
    console.log("listeniing at port:3000")
}) 

