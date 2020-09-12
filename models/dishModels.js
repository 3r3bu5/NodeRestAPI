const mongoose = require( "mongoose" );
require( "mongoose-currency" ).loadType( mongoose );
var Currency = mongoose.Types.Currency;

var commentSchema = new mongoose.Schema( {
	rating:  {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	comment:  {
		type: String,
		required: true
	},
	author:  {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	
	}
}, {
	timestamps: true
} );


var dishSchema = new mongoose.Schema( {
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
	category: {
		type: String,
		required: true
	},
	label: {
		type: String,
		default: ""
	},
	price: {
		type: Currency,
		required: true,
		min: 0
	},
	featured: {
		type: Boolean,
		default:false      
	},
	comments: [ commentSchema ]
}, {
	timestamps: true
} );
const  dishes = mongoose.model( "dish",dishSchema );

module.exports = dishes;