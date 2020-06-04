const express = require('express');
const router = express.Router();
const ctrl = require('./hello.ctrl');

router.get('/', ctrl.hello);

module.exports = router;
