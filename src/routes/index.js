const express = require('express')
const User = require('../models/users')
const router = express.Router();

const jwt = require('jsonwebtoken');
router.get('/', (req, res) => {
    res.send('pagina principal')
})

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    await newUser.save();
    console.log(newUser)
    const token = jwt.sign({ _id: newUser._id }, 'secretkey')
    res.status(200).json({ token })
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(401).send('El correo no existe');
    } else {
        if (user.password !== password) {
            return res.status(401).send('Contraseña incorrecta')
        } else {
            const token = jwt.sign({ _id: user._id }, 'secretkey');
            res.status(200).json({token: token});
        }
    }
})

router.get('/task', (req, res) => {
    res.json([
        {
            _id: 1,
            name: "Task one",
            description: "lorem ipsum",
            date: "2020-22-04"
        },
        {
            _id: 1,
            name: "Task two",
            description: "lorem ipsum",
            date: "2020-22-04"
        },
        {
            _id: 1,
            name: "Task three",
            description: "lorem ipsum",
            date: "2020-22-04"
        }
    ])
})

router.get('/private-task', verifyToken, (req, res)=> {
    res.json([
        {
            _id: 1,
            name: "Task one",
            description: "lorem ipsum",
            date: "2020-22-04"
        },
        {
            _id: 1,
            name: "Task two",
            description: "lorem ipsum",
            date: "2020-22-04"
        },
        {
            _id: 1,
            name: "Task three",
            description: "lorem ipsum",
            date: "2020-22-04"
        }
    ])
})

router.get('/id', verifyToken, (req, res) => {
    res.send(req.userId)
})

function verifyToken (req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Acesso denegado');
    }

    const token = req.headers.authorization.split(' ')[1];

    if(token == 'null'){
        return res.status(401).send('Acesso denegado');
    }

    const payload = jwt.verify(token, 'secretkey');
    req.userId = payload._id;
    next();
}

module.exports = router