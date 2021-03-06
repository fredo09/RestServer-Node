/**
* Rutas de usuarios
*/

const express = require('express');
const bycript = require('bcryptjs');
const _ = require('underscore'); // libreria con funciones basicas de javascript

const app = express();

//Se require el Schema del Usuario
const Usuario = require('../server/models/usuarios');

//Obteniendo la funcion en la que se extrae la el token de autenticacion
const { VerificacionToken, VerificarRole } = require('../server/middlewares/autenticacion')

//Obtener Obsuarios
app.get('/usuario', VerificacionToken ,(req,res) => {

  //Obtener el dato desde para cargar la lista de usuarios en la cunsulta a MongoDB
  let desde = req.query.desde || 0
  desde = Number(desde);
  let limite = req.query.limite || 5
  limite = Number(limite)

  //Busqueda de todos los usarios ocultando algunos campos
  Usuario.find({estado:true},{_id:1,nombre:1,email:1,img:1,estado:1,role:1})
  .skip(desde)
  .limit(limite)
  .exec(( err, usuarioBD ) => { //Ejecutar consulta
    if(err){
      return res.status(400).send({message: err, Status:'Error'})
    }

    //Conteo de todos los usuarios encontrados
    Usuario.count({estado:true}, (err, Numtotal) => {
      res.status(200).send({
        Status: 'Ok',
        Usuarios: usuarioBD,
        Numtotal
      })
    })
  });
})

//Crear Usuarios
app.post('/usuario', [VerificacionToken,VerificarRole] , (req,res) =>{
  let body = req.body;

  //Nueva Instancia de Usuario
  let usuario = new Usuario({
    nombre: body.Nombre,
    email: body.Email,
    password: bycript.hashSync(body.Password,10), //encriptando passwd
    role: body.Role
  });

  //Guardando el Usuario en BD
  usuario.save((err, usuarioBD) => {
    if(err){
      return res.status(400).send({message: err, Status:'Error'})
    }

    //usuarioBD.password = null
    res.status(201).send({
      Status:'Ok',
      Usuario: usuarioBD
    });
  });
})

//Actualiza Usuarios
app.put('/usuario/:Id', [VerificacionToken,VerificarRole] ,(req,res) =>{

  let id = req.params.Id;// opteniendo el id de la url de la peticion

  //USANDO underscore para quitar elemtons de un arreglo JSON
  let body = _.pick(req.body, ['nombre','email','img','role','estado']);

  Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true} ,(err, usuarioBD) =>{
    if(err){
      return  res.status(400).send({message: err, Status:'Error'})
    }
    res.status(200).send( { Status:'Ok',Usuario: usuarioBD} )
  });

})

//Eliminar Usuarios
app.delete('/usuario/:Id', [VerificacionToken,VerificarRole] ,(req,res) =>{

  let id = req.params.Id;

  //Cambiando estado del registro como inactivo
  Usuario.findByIdAndUpdate(id, {estado:false}, {new: true}, (err,usuarioBD) => {
    if(err){
      return res.status(400).send({message: err, Status:'Error'})
    }

    res.status(200).send({
      Status:'Ok',
      usuarioBD
    })
  });
  //Eliminando totalmente de la BD
  // Usuario.findByIdAndRemove(id,(err, usuarioBD) => {
  //   if(err){
  //     return res.status(400).send({message: err, Status:'Error'});
  //   }
  //
  //   if(!usuarioBD){
  //     return res.status(400).send({
  //       Status:'error',
  //       err:{
  //         message: 'Usuario no encontrado'
  //       }
  //     })
  //   }
  //
  //   res.status(200).send({
  //     Status: 'Ok',
  //     Usuario: usuarioBD
  //   })
  // })

})

//Exportando App
module.exports = app;
