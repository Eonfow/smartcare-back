var request = require('superagent');
var config = require('../config.json');
var moment = require('moment');
var firebase = require('firebase');

var baseUrl = "https://"+config.dbAuth+"@"+config.dbUrl;

//inicialize o firebase
var config = {
    apiKey: "AIzaSyCLka5GoGF1Ufx2LoAFSeu-swrns-BRF5s",
    authDomain: "smartcare-fd9db.firebaseapp.com",
    databaseURL: "https://smartcare-fd9db.firebaseio.com",
    storageBucket: "smartcare-fd9db.appspot.com",
    messagingSenderId: "79459045692"
};
firebase.initializeApp(config);

var database = firebase.database();

var quedaDAO = {};

quedaDAO.inserir = function* inserirDAO(idArduino) {
    
    return yield new Promise((resolve, reject) => {
        request.post(baseUrl+"_find")
            .set('Content-Type', 'application/json')
            .send({
              "selector": {
                "collection": "usuarios",
                "idArduino": 12
              },
              "fields": ["_id", "_rev", "nm_usuario"]
            })
            .end(function(err, data) {
                if(err)
                    reject(err);
                else{
                    var resp = JSON.parse(data.text);
                    console.log(resp);
                    
                    //registra a queda no firebase
                    /*
                    database.ref('quedas').push({
                        timestamp: new Date().getTime(),
                        idArduino: idArduino
                    });
                    */
                    
                    resolve(resp);
                }
                    
            });
    });
};

module.exports = quedaDAO;