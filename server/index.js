/**
* Configurando server con express
*/

//requiriendo configuracion del puerto
require('./config')

const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();


//Middlewares
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json()) //Permite mensajes con estructura tipo JSON

app.use(require('../routers'))

//Conexion a mongodb
mongoose.connect(process.env.URL_DB, { useNewUrlParser: true }  ,(err, res) =>{
  if(err) throw err;
  console.log("Conexion establecida");
});

//ESCUCHANDO EN EL PUERTO 3000 SERVIDOR LEVANTADO Y LISTO
app.listen(process.env.PORT, ()=>{
  console.log(`Escuchando en el Puerto ${process.env.PORT}`);
});
