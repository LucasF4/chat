const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    is_online: {
        type: String,
        required: true
    },
    notification: {
        type: Boolean,
        required: true
    }
},
{timestamp: true})

module.exports = mongoose.model('user', userSchema)