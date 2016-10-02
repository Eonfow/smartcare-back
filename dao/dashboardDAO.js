var request = require('superagent');
var config = require('../config.json');
var moment = require('moment');

var dashboardDAO = {};

var baseUrl = "https://"+config.dbAuth+"@"+config.dbUrl;

dashboardDAO.consultar = function* consultarDAO() {
    return yield new Promise((resolve, reject) => {
        request.post(baseUrl+"_find")
            .set('Content-Type', 'application/json')
            .send({
                "selector": {
                    "_id": {"$gt":0}
                },
                "fields": ["_id", "_rev",
                    "collection", "tp_acesso"
                ]
            })
            .end(function(err, data) {
                if(err)
                    reject(err);
                else{
                    var resp = JSON.parse(data.text);
                    var count = {};
                    count["arduino"] = 0;
                    count["pacientes"] = 0;
                    count["cuidadores"] = 0;
                    count["docs"] = 0
                    for(var item of resp.docs){
                        count.docs++;
                        if(item.collection == "arduino"){
                            count.arduino++;
                        }else if(item.collection == "usuarios"){
                            if(item.tp_acesso == "pacientes"){
                                count.pacientes++;
                            }else if(item.tp_acesso == "cuidadores"){
                                count.cuidadores++;
                            }
                        }
                    }
                    var result = {totais: count};
                    resolve(result);
                }
                    
            });
    });
};

module.exports = dashboardDAO;