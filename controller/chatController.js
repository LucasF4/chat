const app = require('express')()
const Chat = require('../models/chatModel')
const auth = require('../middleware/auth')
const moment = require('moment')

app.post('/save-messages', auth, async(req, res) => {
    var { message, received_id, sender_id } = req.body
    var today = moment().format('DD/MM/YYYY hh:mm:ss')

    var chat = new Chat({
        send_id: sender_id,
        receive_id: received_id,
        message: message,
        date_send: today
    })

    await chat.save()
        .then(newChat => {
            res.status(200).json({success: true, data: newChat, msg: "Message saved"})
        })
            .catch( e => {
                res.status(401).json({msg: "Internal Error", error: e})
            })
})

module.exports = app