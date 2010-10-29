function clean_for_json(data) {
    var json= JSON.stringify(data);
    var obj= JSON.parse(json);
    return obj;
}

var app = module.parent.exports;
var sys= app.sys;
var db= app.db;
var ObjectID= app.db.ObjectID;

var Game= db.model('Game');
var GameLocation= db.model('GameLocation');

function set_game(game, game_data) {
    game.title = game_data.title;
    game.synopsis= game_data.synopsis;
    game.author= game_data.author;
    game.rules= game_data.rules;
    game.warnings= game_data.warning;
    game.tips= game_data.tips;
    game.category= [{category_id: 1, name: game_data.category.trim().toLowerCase()}];
    game.locations= (function(situations) {
	var array=[];
	for (var i in situations) {
            array.push({game_location_id: new ObjectID(situations[i].id), description: situations[i].description.trim().toLowerCase()});
	}
	return array;
    })(game_data.situations);
};

app.get('/admin/couple_fun/populate_games', function(req, res) {
    app.populate_games(function() {
	Game.find().all(function(array) {
	    res.send(clean_for_json(array));
	});
    });
});

app.put('/admin/couple_fun/games', function(req, res) {
    var game= {};
    var game_data= req.param('game');

    Game.findById(game_data.id, function(game) {
    	set_game(game, game_data);
    	game.save(function(a){});
    });    
    res.send([]);

});

app.post('/admin/couple_fun/games', function(req, res) {
    var game_data= req.param('game');
    var game = new Game();
    // UT
    set_game(game, game_data);
    game.save(function(a){});    
    res.send([]);
});

app.get('/couple_fun/games/*', function(req, res) {
    Game.findById(req.params[0], function(game) {
	res.send(clean_for_json(game));
    });
});

app.get('/couple_fun/games', function(req, res) {
    var where= {};
    if (req.query.situation) {
	where= {'locations.description':req.query.situation};
    } else if (req.query.situation_id) {
	where= {'locations._id':req.query.situation_id};
    }
    Game.find(where).all(function(array) {
	res.send(clean_for_json(array));
    });
});

app.get('/couple_fun/game_locations', function(req, res) {
    var GameLocation= db.model('GameLocation');
    GameLocation.find().all(function(array) {
	res.send(clean_for_json(array));
    });
});

