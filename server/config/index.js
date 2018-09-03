/**
* Configurar Variables Globales "process.env"
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
//  Vencimiento del Token
//====================

  process.env.CADUCIDAD_TOKEN = 60 * 60 *24 * 30 ;

//====================
//  semilla de autenticacion
//====================

  process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//====================
//  Base de datos
//====================

//ERcilrumhybcim2
let urlBD;

//Checando en que entorno nos  encontramos
if ( process.env.NODE_ENV === 'dev' ){
    urlBD = 'mongodb://localhost:27017/Cafe'; //local
}else{
    urlBD = process.env.MONGO_URI; //produccion
}

//Creando processdo de entorno
process.env.URL_DB = urlBD;
console.log(process.env.URL_DB);
console.log(process.env.SEED);
