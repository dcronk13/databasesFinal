--POKES FUNCTIONS

--Populate pokes page, show typeOne and typeTwo (both references to typeID) as typeName to make user-friendly
SELECT pokeID, pokeName, a.typeName as typeOne, b.typeName as typeTwo, pokeDescription, pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed from pokes p 
JOIN types a ON a.typeID = p.typeOne 
JOIN types b ON b.typeID = p.typeTwo;

--Get types for drop-down menus on pokes page
SELECT typeID, typeName FROM types;

--Get all real types for drop-down menus for adding and updating pokes.
--A NULL type was added to types so that when referencing a poke with no type 2, nothing would be displayed.
--However, when adding or updating, wanted user to not be able to select a NULL type for type 1
SELECT typeID, typeName FROM types EXCEPT SELECT typeID, typeName FROM types WHERE typeID = 1;

--Search functionality by pokeName
SELECT pokeID, pokeName, a.typeName as typeOne, b.typeName as typeTwo, pokeDescription, pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed from pokes p 
JOIN types a ON a.typeID = p.typeOne 
JOIN types b ON b.typeID = p.typeTwo 
WHERE p.pokeName LIKE + mysql.pool.escape(req.params.s + '%');

--Filter Search functionality by types of pokes
SELECT pokeID, pokeName, a.typeName as typeOne, b.typeName as typeTwo, pokeDescription, pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed from pokes p 
JOIN types a ON a.typeID = p.typeOne 
JOIN types b ON b.typeID = p.typeTwo 
WHERE a.typeID = ? OR b.typeID = ?;

--Get specific poke for updating
SELECT pokeID, pokeName, typeOne, typeTwo, pokeDescription, pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed from pokes 
WHERE pokeID = ?

--Insert values into table pokes
INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeDef,pokeSpa,pokeSpd,pokeSpeed) 
VALUES (?,?,?,?,?,?,?,?,?,?);

--Update values for certain pokeID in pokes
UPDATE pokes SET pokeName=?, typeOne=?, typeTwo=?, pokeDescription=?, pokeHP=?, pokeAtk=?, pokeDef=?, pokeSpa=?, pokeSpd=?, pokeSpeed=? 
WHERE pokeID=?;


--TYPES FUNCTIONS
--Note, the * syntax was used much more frequently in this section as there were a lot of attributes to type out for types

--Populate types page, except for the NULL (typeID = 1) which should not be displayed to user
SELECT * FROM types 
EXCEPT 
SELECT * FROM types WHERE typeID = 1;

--Get all types including NULL for type filter drop-down, as selecting NULL will show all types
SELECT * FROM types

--Get one type where typeID = input, used for filtering input
SELECT * FROM types WHERE typeID = ?;
--var inserts = [req.params.types]

--Get on type based off user input, which the user input in this case is edit button getting typeID
SELECT * FROM types WHERE typeID = ?;
--var inserts = [id];

--Insert data into types
INSERT INTO types (typeName,normal,fire,water,grass,electric,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dark,dragon,steel,fairy) 
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);

--Update data in types where typeID = input
UPDATE types SET typeName=?,normal=?,fire=?,water=?,grass=?,electric=?,ice=?,fighting=?,poison=?,ground=?,flying=?,psychic=?,bug=?,rock=?,ghost=?,dark=?,dragon=?,steel=?,fairy=? 
WHERE typeID=?;

--Delete type from types based off input typeID
DELETE FROM types WHERE typeID = ?;



--MOVES FUNCTIONS
--Populate moves page, show moveType (referrenced int from typeID) as typeName to make user-friendly
SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m 
JOIN types a ON a.typeID = m.moveType;

--Get typeName from types for drop-down menus (NULL INCLUDED)
SELECT typeID, typeName FROM types;

--Get typeName from types for drop-down menus (NULL NOT INCLUDED)
SELECT typeID, typeName FROM types 
EXCEPT 
SELECT typeID, typeName FROM types WHERE typeID = 1;

--Search by move name
SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType 
WHERE m.moveName LIKE + mysql.pool.escape(req.params.s + '%')

--Filter by type
SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m 
JOIN types a ON a.typeID = m.moveType 
WHERE a.typeID = ?;

--Filter by move type (physical,special,status). This function requires 3 queries to perform, which are used based off if statements in js file
SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType WHERE m.physical = 1;
SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType WHERE m.special = 1;
SELECT moveID, moveName, a.typeName AS moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves m JOIN types a ON a.typeID = m.moveType WHERE m.status = 1;

--Get specific move for updating
SELECT moveID, moveName, moveType, moveDescription, PP, power, accuracy, physical, special, status, effectChance FROM moves 
WHERE moveID = ?;

--Insert into moves
INSERT INTO moves (moveName,moveType,moveDescription,PP,power,accuracy,physical,special,status,effectChance) 
VALUES (?,?,?,?,?,?,?,?,?,?);

--Update move
UPDATE moves SET moveName=?, moveType=?, moveDescription=?, PP=?, power=?, accuracy=?, physical=?, special=?, status=?, effectChance=? 
WHERE moveID=?;

--Delete move
DELETE FROM moves WHERE moveID = ?


--EVOLUTIONS FUNCTIONS

--Populate evolutions page
--NOTE used IFNULL as sometimes evolutions dont have a pre or post evolution, so we wanted those values in the table to show up and not skip
SELECT evoID, a.pokeName AS pokeEvo, evoCondition, evoLevel, b.pokeName AS preEvo, c.pokeName as postEvo FROM evolutions e 
JOIN pokes a ON a.pokeID = e.pokeEvo 
LEFT JOIN pokes b ON b.pokeID = e.preEvo AND IFNULL(e.preEVO, NULL) 
LEFT JOIN pokes c ON c.pokeID = e.postEvo AND IFNULL(e.postEVO, NULL);

--Get evolutions that have pokeName in either pokeEvo, preEvo, or postEvo
SELECT evoID, a.pokeName AS pokeEvo, evoCondition, evoLevel, b.pokeName AS preEvo, c.pokeName as postEvo FROM evolutions e JOIN pokes a ON a.pokeID = e.pokeEvo LEFT JOIN pokes b ON b.pokeID = e.preEvo AND IFNULL(e.preEVO, NULL) LEFT JOIN pokes c ON c.pokeID = e.postEvo AND IFNULL(e.postEVO, NULL) 
WHERE a.pokeName LIKE  + mysql.pool.escape(req.params.s + '%') +  
OR b.pokeName LIKE  + mysql.pool.escape(req.params.s + '%') +  
OR c.pokeName LIKE  + mysql.pool.escape(req.params.s + '%')

--Get evolutions based off conditions
SELECT evoID, a.pokeName AS pokeEvo, evoCondition, evoLevel, b.pokeName AS preEvo, c.pokeName as postEvo FROM evolutions e JOIN pokes a ON a.pokeID = e.pokeEvo LEFT JOIN pokes b ON b.pokeID = e.preEvo AND IFNULL(e.preEVO, NULL) LEFT JOIN pokes c ON c.pokeID = e.postEvo AND IFNULL(e.postEVO, NULL) 
WHERE evoCondition LIKE  + mysql.pool.escape('%'+ req.params.s + '%');

--Get pokes for drop-down menu
SELECT pokeID, pokeName FROM pokes;

--Get singular evo for updating purposes
SELECT a.pokeName AS pokeID, evoID, pokeEvo, evoCondition, evoLevel, preEvo, postEvo FROM evolutions e 
JOIN pokes a ON e.pokeEvo = a.pokeID 
WHERE evoID = ?;

--Add to evolutions table
INSERT INTO evolutions (pokeEvo,evoCondition,evoLevel,preEvo,postEvo) 
VALUES (?,?,?,?,?)

--Update evolution in table
UPDATE evolutions SET pokeEvo=?, evoCondition=?, evoLevel=?, preEvo=?, postEvo=? WHERE evoID=?

--Delete evolution from table
DELETE FROM evolutions WHERE evoID = ?



--pokeMoves FUNCTIONALITY

--Get pokes information for drop-down
--Note - pokeName is used here to display the name of the poke instead of ID for user-friendliness
SELECT pokeID, pokeName FROM pokes;

--Get moves information for drop-down
--Again, moveName is used here along moveID
SELECT moveID, moveName FROM moves;

--Get display data for pokeMoves
--Joins used here to show name instead of ID for pokes and moves
SELECT p.pid, p.mid,a.pokeName, b.moveName FROM pokeMoves p 
JOIN pokes a ON p.pid = a.pokeID 
JOIN moves b ON p.mid = b.moveID;

--Filter based off pokeName
SELECT p.pokeName, m.moveName FROM pokeMoves pm 
JOIN pokes p ON pm.pid = p.pokeID 
JOIN moves m ON pm.mid = m.moveID 
WHERE pm.pid = ?;

--Filter based off moveName
SELECT p.pokeName, m.moveName FROM pokeMoves pm 
JOIN pokes p ON pm.pid = p.pokeID 
JOIN moves m ON pm.mid = m.moveID 
WHERE pm.mid = ?;

--Insert into pokeMoves
INSERT INTO pokeMoves (pid,mid) 
VALUES (?,?)

--Delete from pokeMoves
DELETE FROM pokeMoves 
WHERE pid = ? AND mid = ?

--NOTE
--Update was not included inside pokeMoves and it didn't make sense to include it functionally
--The user would have to choose from 2 different fields, just as they do for adding.
--In this sense, updating would be no different from deleting then adding again
--While this could be said about the other tables, there is no need for retention of information for this case, making it useless
