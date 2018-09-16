/**
*  Productos Rutas
*/
// const _ = require('underscore');
const express = require('express');
const Producto = require('../server/models/productos');

//Validar Token
const {VerificacionToken} = require('../server/middlewares/autenticacion');

const app = express();

/*Rutas*/
app.get('/productos', VerificacionToken, (req, res) => {

  //Recibiendo el valos de donde se ve los archivos
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Producto.find({disponible: true})
  .populate('categoria', 'descripcion')
  .populate('usuario')
  .skip(desde)
  .limit(5)
  .exec((err, productoBD) =>{
    if(err){
      return res.status(500).send({Status:'Ok', err})
    }

    res.status(200).send({
      Status:'Ok',
      productos: productoBD
    });
  });
});

//Buscar por Id
app.get('/productos/:Id', VerificacionToken, (req, res)=>{
  let id = req.params.Id;
  Producto.findById(id)
  .populate('cateoria', 'descripcion')
  .populate('usuario')
  .exec( (err, productoBD) =>{
    if(err){
      return res.status(500).send({Status:'Ok', err})
    }

    res.status(200).send({
      Status: 'Ok',
      producto: productoBD
    });
  });
});


//Buscar Productos
app.get('/productos/buscar/:termino',VerificacionToken,(req, res) =>{

  let termino = req.params.termino;

  //Expresion regular para crear busquedas mas flexibles
  let regex = new RegExp(termino , 'i');

  Producto.find({nombre: regex})
          .populate('categoria', 'nombre')
          .exec((err, productos) =>{

            if(err){
              return res.status(500).send({ Status: 'Error', err })
            }

            res.status(200).send({Status: 'Ok', productos})
          });
});


//Crear Productos
app.post('/productos', VerificacionToken, (req, res) =>{
  let body = req.body;
  let usuario_id = req.usuario._id;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precio,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario:usuario_id
  });

  producto.save((err, productoBD)=>{
    if(err){
      return res.status(400).send({ Status:'Ok', err })
    }

    if(!productoBD){
      return res.status(400).send({
        Status:'Error',
        err
      });
    }

    res.status(201).send({
      Status:'Ok',
      producto:productoBD
    });
  });
});

//Actualizar Producto
app.put('/productos/:Id',VerificacionToken, (req, res) =>{
    let id = req.params.Id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body ,{new: true, runValidators:true}, (err, productoBD) =>{
      if(err){
        return res.status(400).send({Status: 'Error', err})
      }

      if(!productoBD){
        return res.status(500).send({Status: 'Error', erro})
      }

      res.status(200).send({
        Status: 'Ok',
        categoria: productoBD
      })
    });
});

//Eliminar Producto
app.delete('/productos/:Id', VerificacionToken, (req, res) =>{
    let id = req.params.Id;

    Producto.findByIdAndUpdate(id, {new: true} ,(err, productoBD)=>{
      if(err){
        return res.status(400).send({Status:'Error', err});
      }

      if(!productoBD){
        return res.status(500).send({Status: 'Error', err:{message:'Id no Encontrado'}})
      }

      res.status(200).send({ Status: 'Ok', message:'Producto eliminado', productoBD });
    });
});

//Exportando modulo
module.exports = app;
