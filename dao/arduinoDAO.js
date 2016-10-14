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
                ]
            })
            .end(function(err, data) {
                if(err)
                    reject(err);
                else{
                    var resp = JSON.parse(data.text);
                    resp.docs.sort((a, b)=>{
                        var data1 = moment(a.data, "YYYY-MM-DDTHH:mm.ssZ");
                        var data2 = moment(b.data, "YYYY-MM-DDTHH:mm.ssZ");
                        
                        if(data1.isAfter(data2)){
                            return -1;
                        }else if(data1.isBefore(data2)){
                            return 1;
                        }else{
                            return 0;
                        }
                    });
                    resolve(resp);
                }
                    
            });
    });
};

module.exports = arduinoDAO;