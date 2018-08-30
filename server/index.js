/**
* Configurando server con express
*/

//requiriendo configuracion del puerto
require('./config')

const bodyparser = require('body-parser');
const express = require('express');
const app = express();

//Milddewares
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json()) //Permite mensajes con estructura tipo JSON

app.get('/usuario',(req,res) =>{
  res.send('Hola Mundo!')
})

app.post('/usuario', (req,res) =>{
  let body = req.body;

  if(body.Nombre === undefined){
    res.status(400).send({message: 'Error no has escrito todos los datos', Status:'Error'})
  }else{
    res.status(201).send({
      Usuario:body,
      Status: 'OK'
    })
  }

})

app.put('/usuario/:Id', (req,res) =>{

  let id = req.params.Id;// opteniendo el id de la url de la peticion

  res.send( id)
})

app.delete('/usuario/:Id', (req,res) =>{
  res.send('Hola Delete Mundo')
})

app.listen(process.env.PORT, ()=>{
  console.log('Escuchando en el Puerto 3000');
})
