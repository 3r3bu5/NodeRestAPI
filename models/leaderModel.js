const mongoose = require( "mongoose" );
require( "mongoose-currency" ).loadType( mongoose );


var leaderSchema = new mongoose.Schema( {
	name: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	
	abbr: {
		type: String,
		default: ""
	},
	designation: {
		type: String,
		required: true
	},
	featured: {
		type: Boolean,
		default:false      
	},
	
}, {
	timestamps: true
} );
const leader = mongoose.model( "leader",leaderSchema );

module.exports = leader;