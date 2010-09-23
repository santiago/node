function clean_for_json(data) {
    var json= JSON.stringify(data);
    var obj= JSON.parse(json);
    return obj;
}

var app = module.parent.exports;
var db= app.db;

var Game= db.model('Game');

app.get('/admin/couple_fun/populate_games', function(req, res) {
    app.populate_games(function() {
	Game.find().all(function(array) {
	    res.send(clean_for_json(array));
	});
    });
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

