/**
* Login de Usuarios con JWT "JSON WEB TOKEN"
*/

const express = require('express');
const bycript = require('bcryptjs');

/* JWT */
const jwt = require('jsonwebtoken');

const Usuario = require('../server/models/usuarios');

const app = express();

/*RUTAS*/
app.post('/login',(req,res) => {
  let body = req.body;

  Usuario.findOne({email:body.email}, (err,usuarioBD) =>{

    //Checando algun error
    if(err){
      return res.status(500).send({Status:'Error', message:err})
    }
    //Si no hay usuario registrado
    if(!usuarioBD){
      return res.status(400).send({
        Status: 'Error',
        err:{
          message: 'Usuario o contraseña incorrecto'
        }
      });
    }

    //COMPARANDO CONTRASEÑAS CON bycript
    if(!bycript.compareSync(body.password, usuarioBD.password)){
      return res.status(400).send({
        Status: 'Error',
        err:{
          message: 'Usuario o contraseña incorrecto'
        }
      });
    }

    //Generando el token
    let token = jwt.sign(

      //Informacion del token
    {usuarioBD},
     process.env.SEED,
    {expiresIn: process.env.CADUCIDAD_TOKEN}

  );

    //Mostrando resultado
    res.status(200).send({
      Status:'Ok',
      usuarioBD,
      token
    });

  });
});

module.exports = app;
