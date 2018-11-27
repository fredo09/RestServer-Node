/**
 *  Rutas para las servir las imagenes a la carpeta public
 */

 const express = require('express');
 const path = require('path');
 const fs = require('fs');
 const { VerificacionToken, VerificacionTokenImg } = require('../server/middlewares/autenticacion');

 const app = express();

 //rutas
app.get('/imagen/:tipo/:img', VerificacionTokenImg , (req, res) =>{
  let tipo = req.params.tipo;
  let img = req.params.img;
  //Verificando de que la imagen exista antes de poder borrarla
    let UrlpathImg = path.resolve(__dirname , `../uploads/${ tipo }/${ img }`);

    if(fs.existsSync(UrlpathImg)){
      res.sendFile(UrlpathImg); //Enviando imagen a la vista
    }else{
      let paths_imgs = path.resolve(__dirname, '../server/assets/no-image.jpg');
      res.sendFile(paths_imgs);
    }
});

 module.exports = app;
