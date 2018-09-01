/**
* Login de Usuarios con JWT "JSON WEB TOKEN"
*/

const express = require('express');
const bycript = require('bcryptjs');

const Usuario = require('../server/models/usuarios');

const app = express();

/*RUTAS*/
app.post('/login',(req,res) => {
  res.status(201).send({message:'Hola Login'})
});

module.exports = app;
