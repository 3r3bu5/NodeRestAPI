const mongoose = require( "mongoose" );

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
		type: String,
		required: true
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
		type: Number,
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