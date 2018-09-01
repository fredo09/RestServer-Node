/**
 * Donde se tienen todas las rutas
 */

 const express = require('express');

 const app = express();

 /*Rutas*/
 const paths_usuarios = require('./usuarios')
 const paths_login = require('./login');

//Usando las rutas
 app.use(paths_usuarios);
 app.use(paths_login);


 module.exports = app;
