var usuarioDAO = require("../dao/usuarioDAO.js");

var usuarioController = {};

usuarioController.inserir = function*(req, res){
    return yield usuarioDAO.inserir(req.body.usuario);
};

usuarioController.remover = function*(req, res){
    return yield usuarioDAO.remover(req.params.id, req.params.rev);
};

usuarioController.consultar = function*(req, res){
    return yield usuarioDAO.consultar(req.params.id);
};

usuarioController.atualizar = function*(req, res){
    return yield usuarioDAO.atualizar(req.params.id, req.body.usuario);
};

usuarioController.listar = function*(req, res){
    return yield usuarioDAO.listar();
};

usuarioController.login = function*(req, res){
    console.log(req.body);
    return yield usuarioDAO.login(req.body.login, req.body.senha);
};

usuarioController.associar = function*(req, res){
    return yield usuarioDAO.associar(req.params.idPaciente, req.params.idCuidador);
};

usuarioController.desAssociar = function*(req, res){
    return yield usuarioDAO.desAssociar(req.params.idPaciente, req.params.idCuidador);
};

module.exports = usuarioController;