/*Drops previous tables if they exist*/
DROP TABLE IF EXISTS pokeMoves;
DROP TABLE IF EXISTS moves;
DROP TABLE IF EXISTS evolutions;
DROP TABLE IF EXISTS pokes;
DROP TABLE IF EXISTS types;

/*Table for types*/
CREATE TABLE `types` (
    `typeID` int NOT NULL AUTO_INCREMENT,
    `typeName` varchar (255) UNIQUE,
    /*These type names are numerics that display 0.0.
    These represent the offensive effectiveness of typeName against these types
    Value can be 0, 0.5, 1.0, and 2.0 - Done in the handlebars file*/
    `normal` numeric(2,1) NOT NULL,
    `fire` numeric(2,1) NOT NULL,
    `water` numeric(2,1) NOT NULL,
    `grass` numeric(2,1) NOT NULL,
    `electric` numeric(2,1) NOT NULL,
    `ice` numeric(2,1) NOT NULL,
    `fighting` numeric(2,1) NOT NULL,
    `poison` numeric(2,1) NOT NULL,
    `ground` numeric(2,1) NOT NULL,
    `flying` numeric(2,1) NOT NULL,
    `psychic` numeric(2,1) NOT NULL,
    `bug` numeric(2,1) NOT NULL,
    `rock` numeric(2,1) NOT NULL,
    `ghost` numeric(2,1) NOT NULL,
    `dark` numeric(2,1) NOT NULL,
    `dragon` numeric(2,1) NOT NULL,
    `steel` numeric(2,1) NOT NULL,
    `fairy` numeric(2,1) NOT NULL,
    PRIMARY KEY (`typeID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table information for pokes*/
CREATE TABLE `pokes` (
    `pokeID` int UNIQUE NOT NULL AUTO_INCREMENT,
    /*typeOne + typeTwo references typeID*/
    `typeOne` int NOT NULL,
    `typeTwo` int NOT NULL,
    `pokeName` varchar(255) UNIQUE NOT NULL,
    `pokeDescription` text NOT NULL,
    `pokeHP` int NOT NULL,
    `pokeAtk` int NOT NULL,
    `pokeSpa` int NOT NULL,
    `pokeDef` int NOT NULL,
    `pokeSpd` int NOT NULL,
    `pokeSpeed` int NOT NULL,
    /*FKs set to CASCADE on delete, which deletes FKs associated with parent value so that
    all references to parent can be deleted. 
    Update CASCADE not needed, as all information read by js is in form of ID which cannot be updated.
    So even if attributes get changed, code will still retreive correct information*/
    FOREIGN KEY (`typeOne`) REFERENCES `types` (`typeID`) ON DELETE CASCADE,
    FOREIGN KEY (`typeTwo`) REFERENCES `types` (`typeID`) ON DELETE CASCADE,
    PRIMARY KEY (`pokeID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table for moves*/
CREATE TABLE `moves` (
    `moveID` int NOT NULL AUTO_INCREMENT,
    `moveName` varchar (255) NOT NULL,
    /*moveType references typeID*/
    `moveType` int NOT NULL,
    `PP` int NOT NULL,
    `power` int,
    `accuracy` int,
    `moveDescription` text NOT NULL,
    /*Used Bits for physical,special and status as there is no bool in sql*/
    `physical` BIT,
    `special` BIT,
    `status` BIT,
    `effectChance` int,
    /*Constraint makes it so only one of physical special or status bits can be 1, rest NULL*/
    CONSTRAINT oneNotNull
    CHECK (
        (`physical` IS NOT NULL AND `special` IS NULL AND `status` IS NULL)
    OR  (`special` IS NOT NULL AND `physical` IS NULL AND `status` IS NULL) 
    OR  (`status` IS NOT NULL AND `physical` IS NULL AND `special` IS NULL) 
    ),
    /*Again, using cascade on delete for same reason as pokes*/
    FOREIGN KEY (`moveType`) REFERENCES `types` (`typeID`) ON DELETE CASCADE,
    PRIMARY KEY (`moveID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Evolution table*/
CREATE TABLE `evolutions` (
    `evoID` int NOT NULL AUTO_INCREMENT,
    /*pokeEvo, preEvo, and postEvo all referenced from pokeID*/
    `pokeEVO` int NOT NULL,
    `evoCondition` text NOT NULL,
    `evoLevel` int,
    `preEvo` int,
    `postEvo` int,
    /*Again cascade on delete*/
    FOREIGN KEY (`pokeEvo`) REFERENCES `pokes` (`pokeID`) ON DELETE CASCADE,
    FOREIGN KEY (`preEvo`) REFERENCES `pokes` (`pokeID`) ON DELETE CASCADE,
    FOREIGN KEY (`postEvo`) REFERENCES `pokes` (`pokeID`) ON DELETE CASCADE,
    PRIMARY KEY (`evoID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*pokeMoves Table*/
CREATE TABLE `pokeMoves` (
    /*pid referenced pokeId, mid references moveID*/
    `pid` int NOT NULL,
    `mid` int NOT NULL,
    /*cascade on delete and set FKs*/
    FOREIGN KEY (`pid`) REFERENCES `pokes` (`pokeID`) ON DELETE CASCADE,
    FOREIGN KEY (`mid`) REFERENCES `moves` (`moveID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data Entry values*/

INSERT INTO types (typeName,normal,fire,water,grass,electric,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dark,dragon,steel,fairy)
VALUES (NULL,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

INSERT INTO types (typeName,normal,fire,water,grass,electric,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dark,dragon,steel,fairy)
VALUES ('Fire', 1,.5,.5,2,1,2,1,1,1,1,1,2,.5,1,1,.5,2,1);

INSERT INTO types (typeName,normal,fire,water,grass,electric,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dark,dragon,steel,fairy)
VALUES ('Rock',1,2,1,1,1,2,.5,1,.5,2,1,2,1,1,1,1,.5,1);

INSERT INTO types (typeName,normal,fire,water,grass,electric,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dark,dragon,steel,fairy)
VALUES ('Ghost',0,1,1,1,1,1,1,1,1,1,2,1,1,2,.5,1,1,1);

INSERT INTO types (typeName,normal,fire,water,grass,electric,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dark,dragon,steel,fairy)
VALUES ('Normal',1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);

INSERT INTO types (typeName,normal,fire,water,grass,electric,ice,fighting,poison,ground,flying,psychic,bug,rock,ghost,dark,dragon,steel,fairy)
VALUES ('Water',1,2,.5,.5,1,1,1,1,2,1,1,1,2,1,1,.5,1,1);

INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeSpa,pokeDef,pokeSpd,pokeSpeed)
VALUES('Cyndaquil',(SELECT typeID FROM types WHERE typeName = 'Fire'),(SELECT typeID FROM types WHERE ISNULL(typeName)),'Hails from the Johto region. Though usually curled into a ball due to its timid disposition, it harbors tremendous firepower.',39,52,43,60,50,65);

INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeSpa,pokeDef,pokeSpd,pokeSpeed)
VALUES ('Quilava',(SELECT typeID FROM types WHERE typeName = 'Fire'),(SELECT typeID FROM types WHERE ISNULL(typeName)),'This creatures fur is most mysterious. It is wholly impervious to the burning touch of flame. Should Quilava turn its back to you, take heed! Such a posture indicates a forthcoming attack.',58,64,58,80,65,80);

INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeSpa,pokeDef,pokeSpd,pokeSpeed)
VALUES('Hisuan Typhlosion',(SELECT typeID FROM types WHERE typeName = 'Fire'),(SELECT typeID FROM types WHERE typeName = 'Ghost'),'Said to purify lost, forsaken souls with its flames and guide them to the afterlife. I believe its form has been influenced by the energy of the sacred mountain towering at Hisuis center.',78,84,78,109,85,100);

INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeSpa,pokeDef,pokeSpd,pokeSpeed)
VALUES('Hisuan Growlithe',(SELECT typeID FROM types WHERE typeName = 'Fire'),(SELECT typeID FROM types WHERE typeName = 'Rock'),'They patrol their territory in pairs. I believe the igneous rock components in the fur of this species are the result of volcanic activity in its habitat.',55,70,45,70,50,60);

INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeSpa,pokeDef,pokeSpd,pokeSpeed)
VALUES('Hisuan Arcanine',(SELECT typeID FROM types WHERE typeName = 'Fire'),(SELECT typeID FROM types WHERE typeName = 'Rock'),'Snaps at its foes with fangs cloaked in blazing flame. Despite its bulk, it deftly feints every which way, leading opponents on a deceptively merry chase as it all but dances around them.',90,110,80,100,80,95);

INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeSpa,pokeDef,pokeSpd,pokeSpeed)
VALUES('Snorlax',(SELECT typeID FROM types WHERE typeName = 'Normal'),(SELECT typeID FROM types WHERE ISNULL(typeName)),'This glutton appears in villages without warning and devours the entirety of their rice granaries—such occurrences have long been counted among the gravest of disasters.',160,110,65,65,110,30);

INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeSpa,pokeDef,pokeSpd,pokeSpeed)
VALUES('Munchlax',(SELECT typeID FROM types WHERE typeName = 'Normal'),(SELECT typeID FROM types WHERE ISNULL(typeName)),'Its robust stomach allows it to nonchalantly devour even rotted matter. It pays frequent visits to villages, seeking out food scraps intended for compost.',135,85,40,40,85,5);

INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeSpa,pokeDef,pokeSpd,pokeSpeed)
VALUES('Bidoof',(SELECT typeID FROM types WHERE typeName = 'Normal'),(SELECT typeID FROM types WHERE ISNULL(typeName)),'Bidoof has an unsophisticated face and is rarely flustered by anything. There have been incidents involving Bidoof sauntering into villages and gnawing on the houses without a single care.',59,45,40,35,40,31);

INSERT INTO pokes (pokeName,typeOne,typeTwo,pokeDescription,pokeHP,pokeAtk,pokeSpa,pokeDef,pokeSpd,pokeSpeed)
VALUES('Bibarel',(SELECT typeID FROM types WHERE typeName = 'Normal'),(SELECT typeID FROM types WHERE typeName = 'Water'),'Bibarel fur repels water and is also a fantastic material for heat retention. These Pokemon create dams on rivers to live in.',79,85,60,55,60,71);

INSERT INTO moves (moveName,moveType,PP,`power`,accuracy,moveDescription,physical,special,`status`,effectChance)
VALUES('Flamethrower',(SELECT typeID FROM types WHERE typeName = 'Fire'),15,90,100,'The target is scorched with an intense blast of fire. This may also leave the target with a burn.',NULL,1,NULL,10);

INSERT INTO moves (moveName,moveType,PP,`power`,accuracy,moveDescription,physical,special,`status`,effectChance)
VALUES('Stone Axe',(SELECT typeID FROM types WHERE typeName = 'Rock'),15,65,90,'The user swings its stone axes at the target, aiming to land a critical hit. Stone splinters left behind by this attack continue to damage the target for several turns.',1,NULL,NULL,NULL);

INSERT INTO moves (moveName,moveType,PP,`power`,accuracy,moveDescription,physical,special,`status`,effectChance)
VALUES('Rock Polish',(SELECT typeID FROM types WHERE typeName = 'Rock'),20,NULL,NULL,'The user polishes its body to reduce drag. This can sharply raise the Speed stat.',NULL,NULL,1,NULL);

INSERT INTO moves (moveName,moveType,PP,`power`,accuracy,moveDescription,physical,special,`status`,effectChance)
VALUES('Giga Impact',(SELECT typeID FROM types WHERE typeName = 'Normal'),5,150,90,'The user charges at the target using every bit of its power. The user cant move on the next turn.',1,NULL,NULL,NULL);

INSERT INTO moves (moveName,moveType,PP,`power`,accuracy,moveDescription,physical,special,`status`,effectChance)
VALUES('Swords Dance',(SELECT typeID FROM types WHERE typeName = 'Normal'),20,NULL,NULL,'A frenetic dance to uplift the fighting spirit. This sharply raises the users Attack stat.',NULL,NULL,1,NULL);

INSERT INTO moves (moveName,moveType,PP,`power`,accuracy,moveDescription,physical,special,`status`,effectChance)
VALUES('Hydro Pump',(SELECT typeID FROM types WHERE typeName = 'Water'),5,110,80,'The target is blasted by a huge volume of water launched under great pressure.',NULL,1,NULL,NULL);

INSERT INTO moves (moveName,moveType,PP,`power`,accuracy,moveDescription,physical,special,`status`,effectChance)
VALUES('Liquidation',(SELECT typeID FROM types WHERE typeName = 'Water'),10,85,100,'The user slams into the target using a full-force blast of water. This may also lower the targets Defense stat.',1,NULL,NULL,20);

INSERT INTO evolutions (pokeEvo,evoCondition,evoLevel,preEvo,postEvo)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Quilava'),'Reach level 36',36,(SELECT pokeID FROM pokes WHERE pokeName = 'Cyndaquil'),(SELECT pokeID FROM pokes WHERE pokeName = 'Hisuan Typhlosion'));

INSERT INTO evolutions (pokeEvo,evoCondition,evoLevel,preEvo,postEvo)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Hisuan Growlithe'),'Use a Fire Stone to evolve',NULL,NULL,(SELECT pokeID FROM pokes WHERE pokeName = 'Hisuan Arcanine'));

INSERT INTO evolutions (pokeEvo,evoCondition,evoLevel,preEvo,postEvo)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Munchlax'),'Evolves from happiness',NULL,NULL,(SELECT pokeID FROM pokes WHERE pokeName = 'Snorlax'));

INSERT INTO evolutions (pokeEvo,evoCondition,evoLevel,preEvo,postEvo)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Bidoof'),'Reach level 15',15,NULL,(SELECT pokeID FROM pokes WHERE pokeName = 'Bibarel'));

INSERT INTO pokeMoves (pid,mid)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Quilava'), (SELECT moveID FROM moves WHERE moveName = 'Flamethrower'));

INSERT INTO pokeMoves (pid,mid)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Hisuan Growlithe'), (SELECT moveID FROM moves WHERE moveName = 'Flamethrower'));

INSERT INTO pokeMoves (pid,mid)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Hisuan Growlithe'), (SELECT moveID FROM moves WHERE moveName = 'Rock Polish'));

INSERT INTO pokeMoves (pid,mid)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Bibarel'), (SELECT moveID FROM moves WHERE moveName = 'Giga Impact'));

INSERT INTO pokeMoves (pid,mid)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Bibarel'), (SELECT moveID FROM moves WHERE moveName = 'Hydro Pump'));

INSERT INTO pokeMoves (pid,mid)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Bibarel'), (SELECT moveID FROM moves WHERE moveName = 'Liquidation'));

INSERT INTO pokeMoves (pid,mid)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Snorlax'), (SELECT moveID FROM moves WHERE moveName = 'Giga Impact'));

INSERT INTO pokeMoves (pid,mid)
VALUES ((SELECT pokeID FROM pokes WHERE pokeName = 'Snorlax'), (SELECT moveID FROM moves WHERE moveName = 'Swords Dance'));
