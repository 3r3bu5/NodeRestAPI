const mongoose = require( "mongoose" );

var favoriteSchema = new mongoose.Schema( {

	dishes:  [ {
		type: mongoose.Schema.Types.ObjectId,
		ref: "dish",
		required : true,
		unique: true
	} ],
	

	author:  {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required : true
	
	}
}, {
	timestamps: true
} );

const  favorite = mongoose.model( "favorite",favoriteSchema );

module.exports = favorite;