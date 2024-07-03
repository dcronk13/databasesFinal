module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //Function to get pokes to fill table rows
    function getPokes(res, mysql, context,complete){
        mysql.pool.query("SELECT pokeID, pokeName, a.typeName as typeOne, b.typeName as typeTwo, pokeDescription, pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed from pokes p JOIN types a ON a.typeID = p.typeOne JOIN types b ON b.typeID = p.typeTwo;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pokes  = results;
            complete();
        });
    }

    //function to get types to fill drop down
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

    //function to search by pokeName
    function getPokeName(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
        var query = "SELECT pokeID, pokeName, a.typeName as typeOne, b.typeName as typeTwo, pokeDescription, pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed from pokes p JOIN types a ON a.typeID = p.typeOne JOIN types b ON b.typeID = p.typeTwo WHERE p.pokeName LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.pokes = results;
              complete();
          });
      }

      //function to filter by types
      function getPokesbyType(req, res, mysql, context, complete){
        var query = "SELECT pokeID, pokeName, a.typeName as typeOne, b.typeName as typeTwo, pokeDescription, pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed from pokes p JOIN types a ON a.typeID = p.typeOne JOIN types b ON b.typeID = p.typeTwo WHERE a.typeID = ? OR b.typeID = ?;"
        //Note - Since ? notation called twice for same variable, had to push same types data into inserts to have two of the same value
        //That way, each ? is filled
        var inserts = [req.params.types]
        inserts.push(req.params.types)
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.pokes = results;
              complete();
          });
      }
  
      //get poke by ID for updating. Retrieves all attributes for that specific poke
      function getPoke(res, mysql, context, id, complete){
        var sql = "SELECT pokeID, pokeName, typeOne, typeTwo, pokeDescription, pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed from pokes WHERE pokeID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.poke = results[0];
            complete();
        });
    }

    //Function to get types for update and add typeOne drop down. typeID 1 is NULL so pokes can have a NULL type
    //But typeOne cannot be NULL as pokes must have at least one primary type, so this gets only types that are not NULL
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

    //main route AKA /pokes
    //gets poke data for tables, and two types (one with NULL and one without) to fill drop-downs
    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        context.jsscripts = ["deletePoke.js","filterPokes.js","searchPokes.js"]
        var mysql = req.app.get('mysql');
        getPokes(res, mysql, context,complete);
        getTypes(res, mysql, context,complete);
        getTypesAdd(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pokes', context);
            }
        }
    });

    //Route to display all pokes who start with some string
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePoke.js","filterPokes.js","searchPokes.js"]
        var mysql = req.app.get('mysql');
        getPokeName(req, res, mysql, context, complete);
        getTypes(res, mysql, context,complete);
        getTypesAdd(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pokes', context);
            }
        }
    });

    //Route to filter by types
    router.get('/filter/:types', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePoke.js","filterPokes.js","searchPokes.js"]
        var mysql = req.app.get('mysql');
        getPokesbyType(req,res, mysql, context, complete);
        getTypes(res, mysql, context,complete);
        getTypesAdd(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('pokes', context);
            }

        }
    });

    //route to add poke
    //Note - unlike evolutions, no handling required here for inputs
    //This is because the handlebars sets default values for number variables,
    //and is set to required for all text attributes that can't be null like Name
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed) VALUES (?,?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.Name, req.body.type_1, req.body.type_2, req.body.Description,req.body.HP,req.body.Attack,req.body.Defense,req.body.SpAttack,req.body.SpDefense,req.body.Speed];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/pokes');
            }
        });
    });

    //route for update poke
    //gets one poke information to display on update-poke
    router.get('/:pokeID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["typeSelector.js","updatePokes.js"]
        var mysql = req.app.get('mysql');
        getPoke(res, mysql, context, req.params.pokeID, complete);
        getTypes(res, mysql, context, complete);
        getTypesAdd(res, mysql, context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-poke', context);
            }

        }
    });

    //puts in data from update poke into database
    //Here handling is required for pokeName and pokeDescription, as for some reason it did not work when these values had a value previously
    //If user for some reason deletes these and tries to submit, update does not go through
    router.put('/:pokeID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE pokes SET pokeName=?, typeOne=?, typeTwo=?, pokeDescription=?, pokeHP=?, pokeAtk=?, pokeDef=?, pokeSpa=?, pokeSpd=?, pokeSpeed=? WHERE pokeID=?";
        var inserts = [req.body.Name, req.body.type_1, req.body.type_2, req.body.Description,req.body.HP,req.body.Attack,req.body.Defense,req.body.SpAttack,req.body.SpDefense,req.body.Speed,req.params.pokeID];
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

    //route for poke delete
    router.delete('/:pokeID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM pokes WHERE pokeID = ?";
        var inserts = [req.params.pokeID];
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
