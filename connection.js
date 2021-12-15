// var mysql=require('mysql');

// // créer connection avec la base de données pour
// var con=mysql.createConnection({

//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: "systeme_vols"

// })             

// module.exports = co
const MYSQL = require("mysql");

var con = MYSQL.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "systeme_vols",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = db = {
    get:  (query) => {
        return new Promise( (resolve, reject) => {
            con.query(query, function (err, result) {
                if (err) throw err;
                
                resolve(result);
            });
        });
    },
};


