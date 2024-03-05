const mongoose = require('mongoose')

const uri = process.env.URI

mongoose.connect(uri)
    .then(() => console.log('Conectado ao MongoDB'))
        .catch(error => console.error('Erro ao conectar ao MongoDB:', error));

module.exports = mongoose