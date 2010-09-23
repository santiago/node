require.paths.unshift('../support/mongoose');

var express = require('../support/express/lib/express'),
         fs = require('fs'),
         db = require('./models');

var app = module.exports = express.createServer();

module.exports.db= db;
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
	    game.description= row[6].trim()
	    game.rules= row[7].trim();
	    game.detailed_rules= row[8].trim();
	    game.synopsis= row[5].trim();
	    game.locations= [];
	    game.warnings= row[10].trim();
	    var locations= row[4].split(";");
	    locations.forEach(function(location) {
		var location= location.trim().toLowerCase();
		add_game_location({description:location, games:[{game_id:1, title:game.title}]});
		game.locations.push({game_location_id: 1, description: location});
	    });
	    
	    game.category= [{category_id: 1, name: row[1].trim()}];
	    game.release_date= new Date();
	    game.save(function(a) {
	    });
	});

	// populate game situations
	for (loc in game_locations) {
	    create_game_location(game_locations[loc]);
	}

	callback();
    });
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
    game_location.description= data.description;
    game_location.games= data.games;
    game_location.save(function(a) {
    });
}

app.listen(8000);

