var arduinoDAO = require("../dao/arduinoDAO.js");

var arduinoController = {};

arduinoController.consultar = function*(req, res){
    return yield arduinoDAO.consultar(req.params.id);
};

module.exports = arduinoController;