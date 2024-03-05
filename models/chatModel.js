const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    send_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receive_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    }
},
{timestamp: true})

module.exports = mongoose.model('chat', chatSchema)