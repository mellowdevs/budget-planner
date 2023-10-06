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

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
})

app.use('/data', routes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});

return;
});
  
//start server
app.listen(process.env.PORT || 3000,'0.0.0.0', ()=>{
    console.log("listeniing at port:3000")
}) 

