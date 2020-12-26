const express = require('express');
const router = express.Router();
const request = require('request');
// const mongoose = require('mongoose');
const passport = require('passport');
router.get('/:keyword', (req, res) => {
   
   request({
       uri: `http://api.giphy.com/v1/gifs/search?&api_key=nhYcIGL37mj4LYPqC1Dk1eDt4A074SeD&q=${req.params.keyword}&limit=5`

   }).pipe(res);
})

module.exports = router;


