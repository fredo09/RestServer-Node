/**
*  Categorias Rutas
*/

const _ = require('underscore'); // libreria con funciones basicas de javascript
const express = require('express');
const app = express();

//Recurriendo al Schema de Categoria
const Categorias = require('../server/models/categorias');

//Para validar Token
const {VerificacionToken, VerificarRole} = require('../server/middlewares/autenticacion');

/*Rutas*/
//OBTENER TODAS LAS CATEGORIAS
app.get('/categorias',VerificacionToken , (req, res) => {

  Categorias.find({})
  .sort('descripcion') //Ordena
  .populate('usuario') //muestra toda la informacion de la coleccion de otra tabla que tenga relacion
  .exec((err,categoriaBD)=>{
    if(err){
      return res.status(500).send({
        Status:'Ok',
        err
      });
    }

    Categorias.count({},(err, NumTotal)=>{
      res.status(200).send({
        Status:'Ok',
        categorias: categoriaBD,
        Total: NumTotal
      })
    })
  });
});

//Obtiene Categorias por Id
app.get('/categorias/:Id', VerificacionToken ,(req, res)=>{
  let id = req.params.Id;

  Categorias.findById(id).exec((err,categoriaBD) =>{
    if(err){
      return res.status(500).send({
        Status:'Ok',
        err
      });
    }

    if(!categoriaBD){
      return res.status(500).send({
        Status:'Error',
        err:{
          message: 'El Id no Existe'
        }
      });
    }

    res.status(200).send({
      Status:'Ok',
      categoria: categoriaBD
    });

  });
});

//CREAR CATEGORIAS
app.post('/categorias',[VerificacionToken,VerificarRole], (req, res) =>{
  let body = req.body;
  let id_usuario = req.usuario._id;

  let categoria = new Categorias({
    descripcion: body.descripcion,
    usuario: id_usuario
  });

  categoria.save((err,categoriaBD) =>{
    if(err){
      return res.status(500).send({
        Status:'Ok',
        err
      });
    }

    if(!categoriaBD){
      return res.status(400).send({
        Status:'Error',
        err
      });
    }

    res.status(200).send({
      Status:'Ok',
      categoria: categoriaBD
    });
  });
});

//Actualizar CATEGORIAS
app.put('/categorias/:Id', [ VerificacionToken,VerificarRole ], (req, res) =>{
  let id = req.params.Id;
  let body = _.pick(req.body, ['descripcion']);

  Categorias.findByIdAndUpdate(id, body, {new: true,runValidators:true}, (err, categoriaBD) =>{
    if(err){
      return res.status(400).send({
        Status:'Ok',
        err
      });
    }

    res.status(200).send({ Status:'Ok', categoria:categoriaBD });
  })
});

//Elimina CATEGORIAS
app.delete('/categorias/:Id', [ VerificacionToken, VerificarRole ] ,(req, res) =>{
  let id = req.params.Id;

  Categorias.findByIdAndRemove(id,(err,categoriaBD) =>{
    if(err){
      return res.status(400).send({message: err, Status:'Error'});
    }

    if(!categoriaBD){
      return res.status(400).send({
        Status:'error',
        err:{
          message: 'Categoria no encontrada'
        }
      })
    }

    res.status(200).send({
      Status:'Ok',
      message: 'Categoria Eliminada'
    });

  })
});


//Exportando modulos
module.exports = app;
