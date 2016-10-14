var quedaDAO = require("../dao/quedaDAO");
var quedaController = {};

quedaController.inserir = function*(req, res){
    return yield quedaDAO.inserir(req.body.idArduino);
};

module.exports = quedaController;