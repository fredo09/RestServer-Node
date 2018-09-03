/**
* Middlewares para la autenticacion
*/

const jwt = require('jsonwebtoken');

// =========================
// VERFICICACION DE TOKEN
// =========================

let VerificacionToken  = (req, res , next ) => {

  //Obteniendo el header de la peticion
  let token = req.get('token');


  //jwt.verify('token, semilla (SEED), Callback(err, decode 'token decodificado')')
  jwt.verify(token , process.env.SEED , (err, decoded) => {

    if(err){
      return res.status(401).send({
        Status : 'Error',
        err:{
          message: "Token no valido"
        }
      })
    }

    //tener toda la informacion del usuario en cualquier peticion
    req.usuario = decoded.usuarioBD;

    console.log(req.usuario);

    //Verifica el token y sigue corriendo el programa
    next();
  });

}

// =========================
// VERFICICACION DE ROLE
// =========================

let VerificarRole = (req, res, next) => {

    let token = req.get('token');

    jwt.vefiry(token, process.env.SEED , (err, decoded) => {

    })
}

//Exportando

module.exports = {
  VerificacionToken
}