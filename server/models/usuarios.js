/**
* Modelo de Usuarios
*/

const mongoose = require('mongoose')

//DA UN ASPECTO AMIGABLE SOBRE ALGUN ERROR EN PARTICULAR
const uniqueValidator = require('mongoose-unique-validator')

//Asignando Schema
let Schema =mongoose.Schema;

//Roles Validos
let rolesValidos = {
  values: ['ADMIN_ROLE','USER_ROLE'],
  message: '{VALUE} rol no admitido'
}

//Creando nuevo Schema
let usuarioSchema = new Schema({
  //Datos de del Schema Usuarios
  nombre:{
    type:String,
    required: [true, 'El Nombre es requerido'] //se require a fuerzas el nombre
  },
  email:{
    type:String,
    unique:true,
    required: [true, 'El correo es requerido']
  },
  password:{
    type:String,
    required: [true, 'El passwd es requerido']
  },
  img:{
    type:String,
    required:false
  },
  role:{
    type:String,
    default: 'USER_ROLE',
    enum: rolesValidos //REGLAS DE VALIDACION
  },
  estado:{
    type:Boolean,
    default:true
  },
  google:{
    type:Boolean,
    default:false
  }
});

//Quitando elementos del json de usuarios en MongoDB
usuarioSchema.methods.toJSON = function (){
  let user = this;
  let UserObject = user.toObject();
  delete UserObject.password; //quitamos de la vista el elemento password

  return UserObject;
}

//Agregando uniqueValidator mongoose
usuarioSchema.plugin(uniqueValidator, {
  message: '{PATH} dede ser único'
})

//Exportando el Schema de Usuarios
module.exports = mongoose.model('Users', usuarioSchema)
