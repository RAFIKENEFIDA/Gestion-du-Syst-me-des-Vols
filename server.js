
var con=require("./connection.js");
const http=require('http');
const fs=require('fs');
var ejs = require('ejs');
const _=require('lodash');
var mysql=require('mysql');
const url = require("url");
let routes = require('./router/router');
const PORT = process.env.PORT || 3000;
//   createServer est une  methode pour céer un serveur
 const server=http.createServer(routes);

//  ici nous avons spécifier domaine name
 server.listen(PORT,'localhost',()=>{
     console.log('listening for requests on port 3000'); 
 } );

