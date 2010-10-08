function clean_for_json(data) {
    var json= JSON.stringify(data);
    var obj= JSON.parse(json);
    return obj;
}

var app = module.parent.exports;
var sys= app.sys;
var db= app.db;

var Game= db.model('Game');
var GameLocation= db.model('GameLocation');

app.get('/admin/couple_fun/populate_games', function(req, res) {
    app.populate_games(function() {
	Game.find().all(function(array) {
	    res.send(clean_for_json(array));
	});
    });
});

app.post('/admin/couple_fun/games', function(req, res) {
    var game_data= req.param('game');

    var game = new Game();
    game.title = game_data.name;
    game.author= game_data.author;
    game.rules= game_data.rules;
    game.warnings= game_data.warning;
    game.tips= game_data.tips;
    game.locations= [{game_location_id: game_data.situation.id, description: game_data.situation.description.trim().toLowerCase()}];
    game.category= [{category_id: 1, name: game_data.category.trim().toLowerCase()}];
    game.release_date= new Date();
    game.save(function(a){});

    GameLocation.findById(game_data.situation.id, function(situation) {
	situation.games.push({game_id:game._id, title:game_data.name});
	situation.save(function(a){});
    });


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

