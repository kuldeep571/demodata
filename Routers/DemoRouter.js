const express = require('express');
const
    {
        postdata,
        getdata,
        getsingledata,
    } = require("../Controllers/DemoController");

const router = express.Router();

router.post('/', postdata);

router.get('/', getdata);

router.get('/:id', getsingledata);

module.exports = router;    