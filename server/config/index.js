/**
* Configurar Variables Globales
*/

//====================
//  Puerto
//====================

process.env.PORT = process.env.PORT || 3000

//====================
//  Entorno
//====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
//  Base de datos
//====================

//ERcilrumhybcim2
let urlBD;

if ( urlBD === 'dev' ){
    urlBD = 'mongodb://localhost:27017/Cafe';
}else{
    urlBD = process.env.MONGO_URI
}

//Creando processdo de entorno
process.env.URL_DB = urlBD;
console.log(process.env.URL_DB);
