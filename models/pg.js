var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// PG Schema
var PgSchema = mongoose.Schema({
	Name: {
		type: String,
		index:true
	},
	Pno: {
		type: String
	},
	Email: {
		type: String
	},
	Pname: {
		type: String
    },
  Loco: {
		type: String
    },
  Troom: {
		type: String
    },
  Vroom: {
	  type: String
    },
  Sharing: {
		type: String
    },
  Rent: {
		type: String
    },  
  Extras: {
		type: String
	}
});

var  Pg = module.exports = mongoose.model('Pg', PgSchema);

module.exports.createPg = function(newPg, callback){
	bcrypt.genSalt(10, function(err, salt) {
	        newPg.save(callback);
	});
}

module.exports.getpg = function(callback){
	Pg.find(callback);
}
