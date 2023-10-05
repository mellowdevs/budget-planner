const express = require("express")
const router = express.Router();
const fs = require('fs');

const dataRoutes = require('./data.js') // import account route
router.use(dataRoutes) // use account route

module.exports = router;