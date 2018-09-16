/**
* Schema de categorias
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

let categoriaSchema = new Schema({
  descripcion:{
    type: String,
    unique:true,
    required:[true,'La descriptcion es requerida']
   },
  usuario:{type:Schema.Types.ObjectId, ref:'Users'}
});

module.exports = mongoose.model('Categoria', categoriaSchema);
