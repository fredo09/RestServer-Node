/**
* Rutas para subir archivos con Express
*/

const express = require('express');

//Libreria para subir archivos al servidor
const fileUpload = require('express-fileupload');

//Importando el filesystem y el path para acceder a las rutas de las imagenes
const fs = require('fs');
const path = require('path');

const app = express();

app.use(fileUpload());

//Importando Schemas Usarios y Productos
const Usuario = require('../server/models/usuarios');
const Productos = require('../server/models/productos');

//Creando ruta de subida de archivos
app.put('/upload/:tipo/:id', (req, res) =>{

  let tipo = req.params.tipo;
  let id = req.params.id;

  //Validando los que haiga archivos que subir
  if(!req.files){
    return res.status(400).send({Status : 'Error', message: 'No hay Archivos que subir'})
  }

  //Tipos admitidos
  const tiposValidos = ['productos', 'usuarios'];

  //Validando tipo de archivo a subir
  if(tiposValidos.indexOf(tipo) < 0){
    return res.status(400).send({Status: 'Error' , message: 'No se admiten este tipo rutas para subir archivos'})
  }

  //Obteniendo el archivo
  let files = req.files.archivo;

  //Separando el nombre del archivo
  let nombrefile = files.name.split('.');
  let extencionfile = nombrefile[nombrefile.length-1];

  //Extenciones permitidas
  const extencionesValidas = ['png', 'gif', 'jpg', 'jpeg'];

  //Validando que no las extenciones validas
  if(extencionesValidas.indexOf(extencionfile) < 0){
    return res.status(400).send({Status : 'Error', message: 'Extencion no permitida', extencion: extencionfile})
  }

  //Cambiando el nombre del archivo
  let newFile = `${id}-${new Date().getMilliseconds()}.${extencionfile}`;

  // Use the mv() method to place the file somewhere on your server
  files.mv(`uploads/${tipo}/${newFile}`, (err) => {
    if (err){
      return res.status(500).send({Status: 'Error', message: err});
    }
    //Cargando la imagen
    if ( tipo  == 'usuarios'){
    imagenUsuario(id, res , newFile);
    }else{
    Imgenes_Productos(id, res , newFile);
      }
    //res.status(200).send({Status: 'Ok', message: 'Archivo Subido Correctamente!'});
  });
});

//Funcion para verificar de que imagen se a Subido
function imagenUsuario(id, res, newFile){
  Usuario.findById(id, (err, usuarioBD) =>{

    if (err){
      //Llamando a la funcion
      Borrar_archivos(newFile, 'usuarios');
      return res.status(500).send({Status: 'Error', err});
    }

    if (!usuarioBD){
      //Llamando a la funcion
      Borrar_archivos(newFile, 'usuarios');
      return res.status(400).send({Status: 'Error', err});
    }

    //Llamando a la funcion
    Borrar_archivos(usuarioBD.img, 'usuarios');

    // imagen en la base de datos
    usuarioBD.img = newFile;
    usuarioBD.save((err, newUsuarioBD)=>{
      res.status(200).send({
        Status: 'Ok',
        Message: 'Imagen subida correctamente!',
        img:newFile
      });
    });
  });
}

//Guardando imagenes de los productos
function Imgenes_Productos(id , res, newFile){
  Productos.findById(id, (err, ProductoDB) =>{
    if (err){
      //Llamando a la funcion
      Borrar_archivos(newFile, 'productos');
      return res.status(500).send({Status: 'Error', err});
    }

    if (!ProductoDB){
      //Llamando a la funcion
      Borrar_archivos(newFile, 'productos');
      return res.status(400).send({Status: 'Error', err});
    }

    //Llamando a la funcion
    Borrar_archivos(ProductoDB.img, 'productos');

    // imagen en la base de datos
    ProductoDB.img = newFile;
    ProductoDB.save((err, newProductoDB)=>{
      res.status(200).send({
        Status: 'Ok',
        Message: 'Imagen subida correctamente!',
        img:newFile
      });
    });
  });
}

//Elimina las imagenes
function Borrar_archivos(nombre_Archivo, tipo){
  //Verificando de que la imagen exista antes de poder borrarla
  let UrlpathImg = path.resolve(__dirname , `../uploads/${ tipo }/${ nombre_Archivo }`);

  //Verificando de que el archivo este en la ruta propuesta
  if(fs.existsSync(UrlpathImg)){
    fs.unlinkSync(UrlpathImg); //Eliminando la imagen de los archivos
  }
}

//Importando modulo
module.exports = app;
