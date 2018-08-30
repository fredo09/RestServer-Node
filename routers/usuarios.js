/**
 * Rutas de usuarios
 */

const express = require('express');

const app = express();

//Se require el Schema del Usuario
const Usuario = require('../server/models/usuarios');

 app.get('/usuario',(req,res) =>{
   res.send('Hola Mundo LOCAL!!')
 })

 app.post('/usuario', (req,res) =>{
   let body = req.body;

   //Nueva Instancia de Usuario
   let usuario = new Usuario({
     nombre: body.Nombre,
     email: body.Email,
     password: body.Password,
     role: body.Role
   });

   //Guardando el Usuario en BD
   usuario.save((err, usuarioBD) => {
      if(err){
        return res.status(400).send({message: err, Status:'Error'})
      }

      res.status(201).send({
        Sratus:'Ok',
        Usuario: usuarioBD
      });
   });
 })

 app.put('/usuario/:Id', (req,res) =>{

   let id = req.params.Id;// opteniendo el id de la url de la peticion

   res.send( id)
 })

 app.delete('/usuario/:Id', (req,res) =>{
   res.send('Hola Delete Mundo')
 })

 module.exports = app;
