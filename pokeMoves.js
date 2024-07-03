module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //get pokes for drop-down menu
    function getPokes(res, mysql, context, complete){
        mysql.pool.query("SELECT pokeID, pokeName FROM pokes;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pokes  = results;
            complete();
        });
    }

    //gets moves for drop-down menu
    function getMoves(res, mysql, context, complete){
        mysql.pool.query("SELECT moveID, moveName FROM moves;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.moves  = results;
            complete();
        });
    }

    //gets data to fill pokeMoves table. Gets pokeName and moveName rather than pokeID and moveID for readability
    function getPokeMoves(res, mysql, context, complete){
        mysql.pool.query("SELECT p.pid, p.mid,a.pokeName, b.moveName FROM pokeMoves p JOIN pokes a ON p.pid = a.pokeID JOIN moves b ON p.mid = b.moveID;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pokeMoves  = results;
            complete();
        });
    }

    //filter based of pokeName
    function getPokesbyName(req, res, mysql, context, complete){
        var query = "SELECT p.pokeName, m.moveName FROM pokeMoves pm JOIN pokes p ON pm.pid = p.pokeID JOIN moves m ON pm.mid = m.moveID WHERE pm.pid = ?;"
        var inserts = [req.params.pokes]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.pokeMoves = results;
              complete();
          });
      }

      //filter based off moveName
      function getMovesbyName(req, res, mysql, context, complete){
        var query = "SELECT p.pokeName, m.moveName FROM pokeMoves pm JOIN pokes p ON pm.pid = p.pokeID JOIN moves m ON pm.mid = m.moveID WHERE pm.mid = ?;"
        var inserts = [req.params.moves]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.pokeMoves = results;
              complete();
          });
      }

    //main route AKA /pokeMoves
    //gets data to fill table and drop downs
    router.get('/', function(req, res){
        var context = {};
        context.jsscripts = ["deletePokeMoves.js","filterPokeMoves.js","PokemovesFilter.js"]
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        getPokes(res, mysql, context,complete);
        getMoves(res, mysql, context,complete);
        getPokeMoves(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pokeMoves', context);
            }
        }
    });

    //route for filtering by pokeName
    router.get('/filter/pokes/:pokes', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePokeMoves.js","filterPokeMoves.js","PokemovesFilter.js"]
        var mysql = req.app.get('mysql');
        getPokesbyName(req,res, mysql, context, complete);
        getPokes(res, mysql, context,complete);
        getMoves(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pokeMoves', context);
            }

        }
    });

    //route for filtering by moveName
    router.get('/filter/moves/:moves', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePokeMoves.js","filterPokeMoves.js","PokemovesFilter.js"]
        var mysql = req.app.get('mysql');
        getMovesbyName(req,res, mysql, context, complete);
        getPokes(res, mysql, context,complete);
        getMoves(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pokeMoves', context);
            }

        }
    });

    //route for adding new pokeMoves relationship
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO pokeMoves (pid,mid) VALUES (?,?)";
        var inserts = [req.body.pokes_select, req.body.moves_select];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/pokeMoves');
            }
        });
    });

    //route for deleting pokeMoves relationship
    router.delete('/:pokeID/:moveID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM pokeMoves WHERE pid = ? AND mid = ?";
        var inserts = [req.params.pokeID,req.params.moveID];
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

    //Note, no update included since it was a little redundant with only fillable data being two drop downs
    //Achieved easier with deleting pokeMove, then adding a new one
    
    return router;
}();
