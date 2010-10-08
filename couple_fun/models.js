var mongoose = require('mongoose').Mongoose;
var db = mongoose.connect('mongodb://localhost/couple_fun');

// Define Game Model
mongoose.model('Game', {
    properties: ['title', 
		 'description', 
		 'synopsis',
		 'author', 
		 'rules',
		 'detailed_rules',		 
		 {locations:[['game_location_id', 'description']]}, 
		 {category:[['category_id', 'name']]},
		 'warnings',
		 'tips',
		 'release_date', 
		 'updated_at'],
    
    cast: {
	title: String,
	description: String,
	warnings: String,
	release_date: Date
    },

    indexes: ['title', 'release_date', 'locations.description', 'category.name'],
    
    setters: {
    },
    
    getters: {
    },
    
    methods: {
        save: function(fn){
            this.updated_at = new Date();
            this.__super__(fn);
        }
    },
    
    static: {
    }
    
});

mongoose.model('GameLocation', {
    properties: ['description', {games:[['game_id', 'title']]}, 'updated_at'],
    
    cast: {
	description: String,
	updated_at: Date
    },

    indexes: ['description'],
    
    methods: {
        save: function(fn){
            this.updated_at = new Date();
            this.__super__(fn);
        }
    }
});

module.exports= db;