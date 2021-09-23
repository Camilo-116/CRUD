const express = require('express')
const app = express()
const port = 3000

const mariaDB_connector = require('./mariaDB_connector.js');

app.get('/', (req,res) =>{
    res.send('This works!')
})

app.listen(port, () =>{
    console.log(`Active in http://localhost:${port}`)
})

// Ejemplos código
mariaDB_connector.query("Select * From padres");
