const mongoose = require( "mongoose" );
require( "mongoose-currency" ).loadType( mongoose );
var Currency = mongoose.Types.Currency;


var promoSchema = new mongoose.Schema( {
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
	
}, {
	timestamps: true
} );
const promo = mongoose.model( "promo",promoSchema );

module.exports = promo;