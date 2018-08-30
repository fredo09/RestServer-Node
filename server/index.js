/**
* Configurando server con express
*/

//requiriendo configuracion del puerto
require('./config')

const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const path_usuarios = require('../routers/usuarios')

//Mildewares
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json()) //Permite mensajes con estructura tipo JSON

app.use(path_usuarios)

//Conexion a mongodb
mongoose.connect('mongodb://localhost:27017/Cafe',(err, res) =>{
  if(err) throw err;
  console.log("Conexion establecida");
});

app.listen(process.env.PORT, ()=>{
  console.log('Escuchando en el Puerto 3000');
})
