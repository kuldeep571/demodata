const express = require('express');
const
    {
        postdata,
        loginUser,
        getdata,
        getsingledata,
    } = require("../Controllers/UserController");

const router = express.Router();

router.post('/register', postdata);

router.post('/login', loginUser);

router.get('/', getdata);

router.get('/:id', getsingledata);

module.exports = router;    