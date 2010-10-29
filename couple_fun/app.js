require.paths.unshift('../support/mongoose');

var express = require('../support/express/lib/express'),
         fs = require('fs'),
         db = require('./models'),
         sys = require('sys'),
         ObjectID = require('mongodb').ObjectID

var app = module.exports = express.createServer();
app.configure(function(){
    app.use(express.bodyDecoder());
});

module.exports.db= db;
module.exports.db.ObjectID= ObjectID;
module.exports.sys= sys;
module.exports.populate_games= populate_games;

require('./main');

var Game= db.model('Game');
var GameLocation= db.model('GameLocation');
var game_locations= [];

function populate_games(callback) {
    GameLocation.remove({}, function() {});
    Game.remove({}, function() {});

    fs.readFile('db/couple_fun_seed_tab.csv', "utf8", function(err, data) {
	if (err) throw err;
	var rows= data.split("\n");
	rows.pop();
	var header= rows.shift();
	rows.forEach(function(row) {
	    var row= row.split('\t');
	    var game = new Game();
	    game.title = row[2].trim();
	    game.rules= row[6].trim()+row[7].trim()+row[8].trim();
	    game.synopsis= row[5].trim();
	    game.locations= [];
	    game.warnings= row[10].trim();
	    game.category= [{category_id: 1, name: row[1].trim().toLowerCase()}];
	    game.release_date= new Date();
	    game.save(function(a) {
		var locations= row[4].split(";");
		locations.forEach(function(location) {
		    var location= location.trim().toLowerCase();
		    add_game_to_situation(game,location);
		});
	    });
	});

	callback();
    });
}

function add_game_to_situation(game, description) {
    if (!game_locations[description]) {
	game_locations[description]={description:description, games:[{game_id:game._id, title:game.title}]};
	var situation= new GameLocation();
	situation.description= description;
	situation.games= [{game_id:game._id, title:game.title}];
	situation.save(function(a) {
	    game.locations.push({game_location_id: situation._id, description: situation.description});
	    game.save(function(a) {});
	});
    } else {
	GameLocation.find({description:description}).first(function(situation) {
	    situation.games.push({game_id:game._id, title:game.title});
	    situation.save(function(a) {
		game.locations.push({game_location_id: situation._id, description: situation.description});
		game.save(function(a) {});
	    });
	});
    }
}

function add_situation(data) {
    if (!game_locations[data.description]) {
	game_locations[data.description]=data;
	var situation= new GameLocation();
	situation.description= data.description;
	situation.games= data.games;
	situation.save(function(a) {
	    game_locations[data.description]['_id']= game._id;
	});
    } else {
	GameLocation.findById(game_locations[data.description]._id, function(situation) {
	    situation.games.push();
	});
    }    
}

function add_game_location(data) {
    if (!game_locations[data.description]) {
	game_locations[data.description]=data;
    } else {
	game_locations[data.description].games.push(data.games[0]);
    }
}

function create_game_location(data) {
    var game_location = new GameLocation();
    var current_location= GameLocation.find({description:data.description}).first();
    current_location.game_location_id= data
    game_location.description= data.description;
    game_location.games= data.games;
    game_location.save(function(a) {
    });
}

app.listen(8000);

