var request = require('superagent');
var config = require('../config.json');
var moment = require('moment');

var arduinoDAO = {};

var baseUrl = "https://"+config.dbAuth+"@"+config.dbUrl;

arduinoDAO.consultar = function* consultarDAO(id) {
    return yield new Promise((resolve, reject) => {
        request.post(baseUrl+"_find")
            .set('Content-Type', 'application/json')
            .send({
              "selector": {
                "collection": "arduino",
                "idArduino": Number(id)
              },
              "fields": ["_id", "_rev", 
                    "info", "data"
                ],
                "limit": 5
            })
            .end(function(err, data) {
                if(err)
                    reject(err);
                else{
                    var resp = JSON.parse(data.text);
                    
                    resolve(resp);
                }
                    
            });
    });
};

module.exports = arduinoDAO;