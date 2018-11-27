/**
* Login de Usuarios con JWT "JSON WEB TOKEN"
*/

const express = require('express');
const bycript = require('bcryptjs');

/* JWT */
const jwt = require('jsonwebtoken');

//Google Client ID
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
    {usuarioBD}, //Usuario
    process.env.SEED, // la semilla
    {expiresIn: process.env.CADUCIDAD_TOKEN} //Caducidad

  );

    //Mostrando resultado
    res.status(200).send({
      Status:'Ok',
      usuarioBD,
      token
    });

  });
});

/*CONFIGURACION DE GOOGLE*/
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  //returnamos el objecto con los valores del usuario autenticado por google
  return {
    nombre:payload.name,
    email: payload.email,
    img: payload.picture,
    google:true
  }
}
//verify().catch(console.error);

/*Login Google token*/
app.post('/google', async (req, res) => {
  let token = req.body.idtoken;

  let UserGoogle = await verify(token)
      .catch(e => {
        return res.status(403).send({
          Status: 'Error',
          err:e
        });
      })

  Usuario.findOne({email:UserGoogle.email} , (err, usuarioBD) => {
    if(err){
      return res.status(500).send({
        Status: 'Error',
        message: err
      })
    }
    //Si hay Usuario autenticado
    if(usuarioBD){
      //viendo si el usuario se autentico con google y tiene su email con terminacion email.com
      if(usuarioBD.google === false){
        return res.status(500).send({
          Status: 'Error',
          err:{
            message: 'No se puede autenticar con google use la autenticacion por defecto'
          }
        })
      }else{
        //En dado caso no cumple con lo anterior se renueva el token
        let token = jwt.sign(
        //Informacion del token
        {usuarioBD},
         process.env.SEED,
        {expiresIn: process.env.CADUCIDAD_TOKEN}

      );

      return res.status(200).send({
          Status: 'Ok',
          usuario:usuarioBD,
          token
      });
      }
    }else{
      //si no hay registro del usuario en nuestra base de datos

      let usuario = new Usuario({
        nombre: UserGoogle.nombre,
        email: UserGoogle.email,
        img: UserGoogle.img,
        google: true,
        password: ':)'
      });

      //Guardando el usuario en BD
      usuario.save((err,usuarioBD) => {
        //Checando algun error
        if(err){
          return res.status(500).send({Status:'Error', message:err})
        }

        let token = jwt.sign(
        //Informacion del token
        {usuarioBD},
         process.env.SEED,
        {expiresIn: process.env.CADUCIDAD_TOKEN}

        );

        return res.status(200).send({
          Status:'Ok',
          usuario:usuarioBD,
          token
        });
      })

    }


  });
});

module.exports = app;
