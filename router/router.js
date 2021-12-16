
var ejs = require('ejs');
const fs=require('fs');
const url = require("url");
const _=require('lodash');
var get= require('../connection');
const fetch=require('../queries')
var qs = require('querystring');
const util = require("util");
const formidable = require("formidable");
const nodemailer = require('nodemailer');


var vols
 

const route=(req,res)=>{

    let parsedURL = url.parse(req.url, true);
    let path = parsedURL.pathname;
  
    path = path.replace(/^\/+|\/+$/g, "");

    if(path==""){

      
          // this function called if the path is 'kenny'
      ejs.renderFile('./views/index.ejs', { vols },  function(err, str){
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
               if (err) {
                   console.log(err)
                       res.end();
                       } else {
                       res.end(str);
                       }
           });

    }else if(path=="public/css/style.css"){
        // this function called if the path is 'kenny'
        ejs.renderFile('./public/css/style.css',  function(err, str){
          res.writeHead(200, { "Content-type": "text/css" });
          if (err) {
                     console.log(err)
                         res.end();
                         } else {
                         res.end(str);
                         }
             });
    }
    else if(path == "chercheReservation" && req.method.toLowerCase() == "post"){

        let form=new formidable.IncomingForm(); 
        form.parse(req, async function(err, fields,files){

            if(err){
                // handle your errors here
                console.error(err.message);
                return;
            }

            var obj;
            util.inspect(obj = {fields: fields, files: files})

            // Recupere les vols disponibles
            console.log(obj.fields);

            let today = new Date();

            let hours = String(today.getHours()).padStart(2, "0");
            let minutes = String(today.getMinutes()).padStart(2, "0");
            let seconds = String(today.getSeconds()).padStart(2, "0");

            let year=String(today.getFullYear());
            let month=String(today.getMonth()+1).padStart(2, "0");
            let day=String(today.getDate()).padStart(2, "0");

            let Today=year+'-'+month+'-'+day;
             console.log(Today);
             let DATETIME

            if(Today==obj.fields.dateDepart){

             DATETIME = obj.fields.dateDepart + ' ' + hours + ':' + minutes + ':' + seconds;
            }else{
                DATETIME = obj.fields.dateDepart + ' ' + 00 + ':' + 00 + ':' + 01;
            }
            console.log(DATETIME);
            console.log(fields)
            vols=await get.get(queries.GetVols(DATETIME,obj.fields.depart,obj.fields.arrivee,obj.fields.places));
           console.log(1)
           console.log(vols);
    //   console.log("ccc",AllEscales);
            res.writeHead(200, { "Content-Type": "text/html" });
            let htmlContent = fs.readFileSync('./views/index.ejs', 'utf8');
            let htmlRenderized = ejs.render(htmlContent,{vols});
            res.end(htmlRenderized);
           
        })

    }
    else if(path == "InsertReservation" && req.method.toLowerCase() == "post"){
        
        let form=new formidable.IncomingForm(); 
        form.parse(req, async function(err, fields,files){

            if(err){
                // handle your errors here
                console.error(err.message);
                return;
            }

            var obj;
            util.inspect(obj = {fields: fields, files: files})
            var id;
            
            id=await get.get(queries.InsertClient(obj.fields));
            
            console.log(id.insertId);
         
            var code= Math.random().toString(36).substr(2) + obj.fields.nom.split("@", 1);
            console.log(code)

          var id_reservation=  await get.get(queries.InsertReservation({id:obj.fields.id,client_id:id.insertId,code:code}))
          var detailReservation= await get.get(queries.RecupereVol(id_reservation.insertId))
           console.log(detailReservation);

          if(id_reservation){
          var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'testcoding975@gmail.com',
                pass: 'testCoding1998'
              }
            });            
            var mailOptions = {
              from: 'testcoding975@gmail.com',
              to: 'rafikcoding@gmail.com',
              subject: 'Air Maroc, Detail Sur Votre Reservation ',
              text: 'Salut  ' + detailReservation[0].nom+ 
               ' Vous êtes reserver une vols  :  depart de   '+ detailReservation[0].depart+ ' à '+detailReservation[0].time_depart + ' vers ' + detailReservation[0].arrivee +  ' à  ' + detailReservation[0].time_arrivee+
               ' Prix ' + detailReservation[0].prix+
               ' Votre code de reference est :' + detailReservation[0].code
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }
      
         
            res.writeHead(200, { "Content-Type": "text/html" });
            let htmlContent = fs.readFileSync('./views/index.ejs', 'utf8');
            let htmlRenderized = ejs.render(htmlContent,{vols});
            res.end(htmlRenderized);
           
        })
    }
    else if(path=="index.js"){

        ejs.renderFile('./views/index.js',  function(err, str){
            res.writeHead(200, { "Content-type": "text/javascript" });
            if (err) {
                       console.log(err)
                           res.end();
                           } else {
                           res.end(str);
                           }
               });

    }
    else if(path=="notFound"){


        ejs.renderFile('./views/404.ejs', { name:{
            hicham:"rafik"
        } },  function(err, str){
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                   if (err) {
                       console.log(err)
                           res.end();
                           } else {
                           res.end(str);
                           }
               });

    }


    
}


  module.exports =route;