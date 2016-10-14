var request = require('superagent');
var config = require('../config.json');
var moment = require('moment');
var firebase = require('firebase');

var baseUrl = "https://"+config.dbAuth+"@"+config.dbUrl;

//inicialize o firebase
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
                "idArduino": idArduino
              },
              "fields": ["_id", "_rev", "nm_usuario"]
            })
            .end(function(err, data) {
                if(err)
                    reject(err);
                else{
                    var resp = JSON.parse(data.text);

                    if(resp && resp.docs.length > 0) {
                        //registra a queda no firebase
                        database.ref('quedas').push({
                            timestamp: new Date().getTime(),
                            idArduino: idArduino,
                            nomePaciente: resp.docs[0].nm_usuario
                        });

                        resolve('Queda registrada!');                       
                    }
                    else {
                        reject('Usuario nao encontrado');
                    }
                }
                    
            });
    });
};

module.exports = quedaDAO;