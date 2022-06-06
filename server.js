const express = require('express')
const serveStatic = require('serve-static')
const path =require('patch')

const app = express()
// serves file from our dist directory with now contains out in index.html file
app.use ('/',serveStatic(path.join(__dirname, '/dist')))

const port  = process.env.PORT || 8080
app.listen(port)

console.log('listening on port' + port)
