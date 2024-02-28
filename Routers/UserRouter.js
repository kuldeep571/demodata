const express = require('express');
const
    {
        postdata,
        loginUser,
        getdata,
        getsingledata,
        forgotPassword,
        resetPassword,
        getTodayAllData,
        getYesterdayAllData
    } = require("../Controllers/UserController");

const router = express.Router();

router.post('/register', postdata);

router.post('/login', loginUser);

router.get('/', getdata);

router.get('/yesterday', getYesterdayAllData);

router.get('/today', getTodayAllData );

router.get('/:id', getsingledata);

router.post('/forgotPassword', forgotPassword);

router.post('/resetPassword', resetPassword);

module.exports = router;    