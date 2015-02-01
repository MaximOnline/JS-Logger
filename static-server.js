var app = require('express')();
var express = require('express');
app.use(express.static(__dirname));
app.listen(3000);