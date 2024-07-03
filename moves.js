module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getMoves(res, mysql, context,complete){
        mysql.pool.query("SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.moves  = results;
            complete();
        });
    }

    function getTypes(res, mysql, context, complete){
        mysql.pool.query("SELECT typeID, typeName FROM types;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.types  = results;
            complete();
        });
    }

    function getMoveName(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
        var query = "SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType WHERE m.moveName LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.moves = results;
              complete();
          });
      }

      function getMovesbyType(req, res, mysql, context, complete){
        var query = "SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType WHERE a.typeID = ?;"
        var inserts = [req.params.types]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.moves = results;
              complete();
          });
      }

      function getMovesbyMoveType(req, res, mysql, context, complete){
        var check = req.params.s
        if (check == "physical"){
            var query = "SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType WHERE m.physical = 1;"
        }
        else if (check == "special"){
            var query = "SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType WHERE m.special = 1;"
        }
        else {
            var query = "SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType WHERE m.status = 1;"
        }
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.moves = results;
              complete();
          });
      }

      function getTypesAdd(res, mysql, context, complete){
        mysql.pool.query("SELECT typeID, typeName FROM types EXCEPT SELECT typeID, typeName FROM types WHERE typeID = 1;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.typesAdd  = results;
            complete();
        });
    }

    function getMove(res, mysql, context, id, complete){
        var sql = "SELECT moveID, moveName, moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves WHERE moveID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.move = results[0];
            complete();
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        context.jsscripts = ["searchMoves.js","filterMoves.js","movesFilter.js","deleteMove.js"]
        var mysql = req.app.get('mysql');
        getMoves(res, mysql, context,complete);
        getTypes(res, mysql, context,complete);
        getTypesAdd(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('moves', context);
            }
        }
    });

    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchMoves.js","filterMoves.js","movesFilter.js","deleteMove.js"]
        var mysql = req.app.get('mysql');
        getMoveName(req, res, mysql, context, complete);
        getTypes(res, mysql, context,complete);
        getTypesAdd(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('moves', context);
            }
        }
    });

    router.get('/filter/types/:types', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchMoves.js","filterMoves.js","movesFilter.js","deleteMove.js"]
        var mysql = req.app.get('mysql');
        getMovesbyType(req,res, mysql, context, complete);
        getTypes(res, mysql, context,complete);
        getTypesAdd(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('moves', context);
            }

        }
    });

    router.get('/filter/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchMoves.js","filterMoves.js","movesFilter.js","deleteMove.js"]
        var mysql = req.app.get('mysql');
        getMovesbyMoveType(req,res, mysql, context, complete);
        getTypes(res, mysql, context,complete);
        getTypesAdd(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('moves', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var check = req.body.moveTypeAdd;
        var phys = null;
        var spec = null;
        var stat = null;
        var pow = req.body.Power;
        var acc = req.body.Accuracy;
        var eff = req.body.EffectChance;
        if (check == "physical"){
            phys = 1;
        }
        if (check == "special") {
            spec = 1;
        }
        if (check == "status") {
            stat = 1;
        }
        if (pow == 0){
            pow = null;
        }
        if (acc == 0) {
            acc = null;
        }
        if (eff == 0) {
            eff = null;
        }
        var sql = "INSERT INTO moves (moveName,moveType,moveDescription,PP,power,accuracy,physical,special,status,effectChance) VALUES (?,?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.Name, req.body.type_add, req.body.Description, req.body.PP, pow, acc, phys, spec, stat, eff];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/moves');
            }
        });
    });

    router.get('/:moveID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["moveSelector.js","updateMoves.js"]
        var mysql = req.app.get('mysql');
        getMove(res, mysql, context, req.params.moveID, complete);
        getTypesAdd(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-move', context);
            }

        }
    });

    router.put('/:moveID', function(req, res){
        var mysql = req.app.get('mysql');
        var check = req.body.moveType;
        var phys = null;
        var spec = null;
        var stat = null;
        var pow = req.body.Power;
        var acc = req.body.Accuracy;
        var eff = req.body.EffectChance;
        if (check == "physical"){
            phys = 1;
        }
        if (check == "special") {
            spec = 1;
        }
        if (check == "status") {
            stat = 1;
        }
        if (pow == 0){
            pow = null;
        }
        if (acc == 0) {
            acc = null;
        }
        if (eff == 0) {
            eff = null;
        }
        var sql = "UPDATE moves SET moveName=?, moveType=?, moveDescription=?, PP=?, power=?, accuracy=?, physical=?, special=?, status=?, effectChance=? WHERE moveID=?";
        var inserts = [req.body.Name, req.body.type, req.body.Description, req.body.PP, pow, acc, phys, spec, stat, eff, req.params.moveID];
        if (req.body.Name == "" || req.body.Description == "") {
            res.status(200);
            res.end();
            return;
        }
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/:moveID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM moves WHERE moveID = ?";
        var inserts = [req.params.moveID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
