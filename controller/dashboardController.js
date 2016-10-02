var arduinoDAO = require("../dao/dashboardDAO");
var dashboardController = {};

dashboardController.consultar = function*(req, res){
    return yield arduinoDAO.consultar();
};

module.exports = dashboardController;