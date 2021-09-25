const express = require('express')
const app = express()
const port = 3000

// Static folder with images
app.use(express.static(__dirname + 'src/images'))

// Home url
app.get('/', (req,res) =>{
    res.send('This works!')
})

// Childs url
app.get('/hijos', (req,res) =>{
    res.send('Seccion de hijos')
})

// Parents urls
app.get('/padres', (req,res) =>{
    res.send('Seccion de hijos')
})

app.listen(port, () =>{
    console.log(`Active in http://localhost:${port}`)
})