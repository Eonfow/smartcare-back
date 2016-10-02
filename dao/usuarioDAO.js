var request = require('superagent');
var config = require('../config.json');
var moment = require('moment');

const crypto = require('crypto');

var baseUrl = "https://"+config.dbAuth+"@"+config.dbUrl;

var usuarioDAO = {};

usuarioDAO.inserir = function* inserirDAO(novoUsuario) {
    novoUsuario["collection"] = "usuarios";
    novoUsuario["cuidadores"] = [];
    novoUsuario["paciente"] = [];
    novoUsuario["responsaveis"] = [];
    novoUsuario["idArduino"] = -1;
    
    var hmac = crypto.createHmac('sha512', config.salt);
    novoUsuario["senha"] = hmac.update(novoUsuario.senha).digest('hex');       
    
    return yield new Promise((resolve, reject) => {
        request.post(baseUrl)
            .set('Content-Type', 'application/json')
            .send(novoUsuario)
            .end(function(err, data) {
                if(err)
                    reject(err);
                else
                    resolve(JSON.parse(data.text));
            });
    });
};

usuarioDAO.remover = function* removerDAO(id, rev) {
    return yield new Promise((resolve, reject) => {
        request.delete(baseUrl+id+"?rev="+rev)
            .end(function(err, data) {
                if(err)
                    reject(err);
                else
                    resolve(data);
            });
    });
};

usuarioDAO.consultar = function* consultarDAO(id) {
    return yield new Promise((resolve, reject) => {
        request.get(baseUrl+id)
            .end(function(err, data) {
                if(err)
                    reject(err);
                else{
                    if(data.text.docs && data.text.docs.length > 0){
                        resolve(JSON.parse(data.text.docs[0]));
                    }else{
                        reject("Usuario nao encontrado");
                    }
                }
            });
    });
};

usuarioDAO.atualizar = function* atualizarDAO(id, newInfo) {
    return yield new Promise((resolve, reject) => {
        request.put(baseUrl+id)
            .send(newInfo)
            .set('Content-Type', 'application/json')
            .end(function(err, data) {
                if(err)
                    reject(err);
                else
                    resolve(JSON.parse(data.text));
            });
    });
};

usuarioDAO.listar = function* listarDAO() {
    return yield new Promise((resolve, reject) => {
        request.post(baseUrl+"_find")
            .set('Content-Type', 'application/json')
            .send({
              "selector": {
                "collection": "usuarios"
              },
              "fields": ["_id", "_rev", 
                    "nm_usuario", "tp_acesso", "sexo", "login", "email", "idArduino",
                    "pacientes", "dt_nascimento", "cuidadores", "responsaveis"
                ]
            })
            .end(function(err, data) {
                if(err)
                    reject(err);
                else{
                    var resp = JSON.parse(data.text);
                    for(var info of resp.docs){
                        info.dt_nascimento = moment(info.dt_nascimento).format("DD/MM/YYYY");
                    }
                    resolve(resp);
                }
                    
            });
    });
};

usuarioDAO.login = function* loginDAO(login, senha) {
    return yield new Promise((resolve, reject) => {
        var index = login.indexOf("@") == -1 ? "login" : "email";
        var selector = {};
        selector[index] = login;
        
        request.post(baseUrl+"_find")
            .set('Content-Type', 'application/json')
            .send({
              "selector": selector,
              "fields": ["_id", "_rev", 
                    "nm_usuario", "tp_acesso", "sexo", "login", "email", "senha",
                    "pacientes", "dt_nascimento", "cuidadores", "responsaveis"
                ]
            })
            .end(function(err, data) {
                if(err)
                    return reject(err);
                else{
                    var resp = JSON.parse(data.text);
                    if(!resp.docs || resp.docs.length == 0){
                        return reject("Usuario/Senha inválidos");
                    }
                    
                    var hmac = crypto.createHmac('sha512', config.salt);
                    senha = hmac.update(senha).digest('hex');
                    
                    var info = resp.docs[0];
                    if(info.senha == senha){
                        info.senha = "";
                        info.dt_nascimento = moment(info.dt_nascimento).format("DD/MM/YYYY");
                        return resolve(info);
                    }else
                        return reject("Usuario/Senha inválidos");
                }
            });
    });
};

usuarioDAO.associar = function* associarDAO(idPaciente, idCuidador) {
    var paciente = usuarioDAO.consultarDAO(idPaciente);
    var cuidador = usuarioDAO.consultarDAO(idCuidador);
    
    paciente.cuidadores.push(cuidador);
    cuidador.pacientes.push(paciente);
    
    usuarioDAO.atualizar(idPaciente, paciente);
    usuarioDAO.atualizar(idCuidador, cuidador);
    
    return true;
};

usuarioDAO.desAssociar = function* desAssociarDAO(idPaciente, idCuidador) {
    var paciente = usuarioDAO.consultarDAO(idPaciente);
    var cuidador = usuarioDAO.consultarDAO(idCuidador);
    
    for(var i=0; i < paciente.cuidadores; i++){
        var c = paciente.cuidadores[i];
        if(c._id == idCuidador){
            paciente.cuidadores.splice(i, 1);
        }
    }
    for(var i=0; i < cuidador.pacientes; i++){
        var p = cuidador.pacientes[i];
        if(p._id == idPaciente){
            cuidador.pacientes.splice(i, 1);
        }
    }
    
    usuarioDAO.atualizar(idPaciente, paciente);
    usuarioDAO.atualizar(idCuidador, cuidador);
    
    return true;
};


module.exports = usuarioDAO;