/**
 * Donde se tienen todas las rutas
 */

 const express = require('express');

 const app = express();

 /*Rutas*/
 const paths_usuarios = require('./usuarios')
 const paths_login = require('./login');
 const paths_categorias = require('./categorias');
 const paths_productos = require('./producto');

 //Usando las rutas
 app.use(paths_usuarios);
 app.use(paths_login);
 app.use(paths_categorias);
 app.use(paths_productos);

 module.exports = app;
