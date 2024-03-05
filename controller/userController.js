const app = require('express').Router()
const User = require('../models/userModel')
const auth = require('../middleware/auth')

app.post('/register', async (req, res) => {
    var { name, email, senha } = req.body
    console.log(name, email, senha)

    const userExist = await User.findOne({email: email})
    console.log(userExist)

    if(userExist){
        return res.status(400).json({msg: "email registed"})
    }else{
        const user = new User({
            name: name,
            email: email,
            image: 'images/teste.png',
            is_online: '0',
            senha: senha
        })
    
        await user.save().then(result => {
            console.log(result)
            res.status(201).json({msg: 'Created'})
        })
        .catch(e => {
            res.status(400).json({msg: 'Error to Insert Data', error: e})
        })
    }
    
})

/* app.get('/friends', auth,async (req, res) => {
    console.log(req.session.user)
    var friends = await User.find({_id: {$nin: [req.session.user._id]}}, {senha: 0, _id: 0, email: 0})

    res.status(200).json({friends: friends})
}) */

app.get('/login', (req, res) => {
    var erro = req.flash('erroLogin')
    erro = (erro == undefined || erro.length == 0) ? undefined : erro
    res.render('user/login', {erro: erro})
})

app.post('/login', async(req, res) => {
    var { email, senha } = req.body

    const userExist = await User.findOne({email: email, senha: senha}, {senha: 0})

    if(userExist){
        req.session.user = userExist;
        res.redirect('/')

    }else{
        var erro = `Credenciais Incorretas`
        req.flash("erroLogin", erro)
        res.redirect('/login')
    }
})

app.get('/logout', async (req, res) => {
    var erro = `Usuário Desconectado`
    req.flash('erroLogin', erro)
    req.session.user = undefined
    res.redirect('/login')
    //res.status(200).json({msg: 'User Logout with success'})
})

app.get('/', auth, async (req, res) => {
    var friends = await User.find({_id: {$nin: [req.session.user._id]}}, {senha: 0, email: 0})
    res.render('index', {user: req.session.user, friends: friends})
})

module.exports = app