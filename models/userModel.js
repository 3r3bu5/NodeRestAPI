var mongoose = require( "mongoose" );
var Schema = mongoose.Schema;
const passportLocalMongoose = require( "passport-local-mongoose" );


var User = new Schema( {
	
	firstname: {
		type: String,
		default: ""
	},
	facebookId: String,
	githubId: String,
	fullname: String,
	lastname: {
		type: String,
		default: ""
	},
	admin:   {
		type: Boolean,
		default: false
	}
} );

User.plugin( passportLocalMongoose );

module.exports = mongoose.model( "User", User );