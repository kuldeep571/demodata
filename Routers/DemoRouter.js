const express = require('express');
const {
    postdata,
    getdata,
    getsingle,
    deletedata,
    Putdata,
} = require("../Controllers/DemoController");

const router = express.Router();

router.post('/', postdata);

router.put('/:id', Putdata);

router.get('/', getdata);

router.get('/:id', getsingle);

router.delete('/:id', deletedata);

module.exports = router;