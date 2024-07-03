module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //get evolution info to fill in handlbars template
    function getEvos(res, mysql, context,complete){
        mysql.pool.query("SELECT evoID, a.pokeName AS pokeEvo, evoCondition, evoLevel, b.pokeName AS preEvo, c.pokeName as postEvo FROM evolutions e JOIN pokes a ON a.pokeID = e.pokeEvo LEFT JOIN pokes b ON b.pokeID = e.preEvo AND IFNULL(e.preEVO, NULL) LEFT JOIN pokes c ON c.pokeID = e.postEvo AND IFNULL(e.postEVO, NULL);", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.evos  = results;
            complete();
        });
    }

    //search based off pokeName
    function getEvoPokes(req, res, mysql, context, complete) {
        var query = "SELECT evoID, a.pokeName AS pokeEvo, evoCondition, evoLevel, b.pokeName AS preEvo, c.pokeName as postEvo FROM evolutions e JOIN pokes a ON a.pokeID = e.pokeEvo LEFT JOIN pokes b ON b.pokeID = e.preEvo AND IFNULL(e.preEVO, NULL) LEFT JOIN pokes c ON c.pokeID = e.postEvo AND IFNULL(e.postEVO, NULL) WHERE a.pokeName LIKE " + mysql.pool.escape(req.params.s + '%') + " OR b.pokeName LIKE " + mysql.pool.escape(req.params.s + '%') + " OR c.pokeName LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.evos = results;
              complete();
          });
      }

      //search off condition
      //Notes this uses two % before and after input. This finds and instance anywhere in the text
      //This is useful as evo conditions can be anything from level, to giving a stone/item or maxing out happiness
      //With the %input%, users can say stone, or happiness to find all instances of pokemon that evolve in that method
      function getEvoCons(req, res, mysql, context, complete) {
        var query = "SELECT evoID, a.pokeName AS pokeEvo, evoCondition, evoLevel, b.pokeName AS preEvo, c.pokeName as postEvo FROM evolutions e JOIN pokes a ON a.pokeID = e.pokeEvo LEFT JOIN pokes b ON b.pokeID = e.preEvo AND IFNULL(e.preEVO, NULL) LEFT JOIN pokes c ON c.pokeID = e.postEvo AND IFNULL(e.postEVO, NULL) WHERE evoCondition LIKE " + mysql.pool.escape('%'+ req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.evos = results;
              complete();
          });
      }

      //get pokes to populate drop-down menu
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

    //get evo for updating purposes. Gets information for evoID to put into update-evo
    function getEvo(res, mysql, context, id, complete){
        var sql = "SELECT a.pokeName AS pokeID, evoID, pokeEvo, evoCondition, evoLevel, preEvo, postEvo FROM evolutions e JOIN pokes a ON e.pokeEvo = a.pokeID WHERE evoID = ?;";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.evo = results[0];
            complete();
        });
    }

    //main route AKA /evolutions
    //Gets main data for display and data from pokes for drop-downs
    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        context.jsscripts = ["searchEvosByName.js","searchEvoCons.js","deleteEvo.js"]
        var mysql = req.app.get('mysql');
        getEvos(res, mysql, context,complete);
        getPokes(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('evolutions', context);
            }
        }
    });

    //route for searching by pokeName
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchEvosByName.js","searchEvoCons.js","deleteEvo.js"]
        var mysql = req.app.get('mysql');
        getEvoPokes(req, res, mysql, context, complete);
        getPokes(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('evolutions', context);
            }
        }
    });

    //route for searching by condition
    router.get('/search/condition/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["searchEvosByName.js","searchEvoCons.js","deleteEvo.js"]
        var mysql = req.app.get('mysql');
        getEvoCons(req, res, mysql, context, complete);
        getPokes(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('evolutions', context);
            }
        }
    });

    //route for adding evo
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        //used these to give proper values. Since html can't process NULL
        //if user inputs "", switches to NULL
        var level = req.body.Level;
        var pre = req.body.poke_pre_add;
        var post = req.body.poke_post_add;
        if (level == "") {
            level = null;
        }
        if (pre == "") {
            pre = null;
        }
        if (post == "") {
            post = null;
        }
        //This used if both pre and post evolutions are null, which would defeat the purpose of a evolution
        if (pre == null && post == null){
            res.redirect('/evolutions');
            return;
        }
        var sql = "INSERT INTO evolutions (pokeEvo,evoCondition,evoLevel,preEvo,postEvo) VALUES (?,?,?,?,?)";
        var inserts = [req.body.poke_add, req.body.Condition, level, pre, post];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/evolutions');
            }
        });
    });

    //route for update, gets data to put into update-evo
    router.get('/:evoID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectEvo.js","updateEvo.js"]
        var mysql = req.app.get('mysql');
        getEvo(res, mysql, context, req.params.evoID, complete);
        getPokes(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-evo', context);
            }

        }
    });

    //route for inputting update data into database
    //Again, uses values to check for "" and replace with NULL
    router.put('/:evoID', function(req, res){
        var mysql = req.app.get('mysql');
        var level = req.body.Level;
        var pre = req.body.poke_pre;
        var post = req.body.poke_post;
        if (level == "") {
            level = null;
        }
        if (pre == "") {
            pre = null;
        }
        if (post == "") {
            post = null;
        }
        var sql = "UPDATE evolutions SET pokeEvo=?, evoCondition=?, evoLevel=?, preEvo=?, postEvo=? WHERE evoID=?";
        var inserts = [req.body.poke, req.body.Condition, level, pre, post, req.params.evoID];
        if (pre == null && post == null) {
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

    //Route for deleting evolutions
    router.delete('/:evoID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM evolutions WHERE evoID = ?";
        var inserts = [req.params.evoID];
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
