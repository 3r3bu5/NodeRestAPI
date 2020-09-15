var express = require( "express" );
var cors = require( "cors" );

var allowedOrigins = [ 
	"http://localhost:3000",
	"https://localhost:3443" ];
    
var corsOptionsDelegate = ( req, callback ) => {
	var corsOptions;
	console.log( req.header( "Origin" ) );
	if( allowedOrigins.indexOf( req.header( "Origin" ) ) !== -1 ) {

		corsOptions = { origin: true };
	}
	else {
		corsOptions = { origin: false };
		var msg = "The CORS policy for this site does not " +
		"allow access from the specified Origin.";
		return callback( new Error( msg ), false );
	}

	return callback( null, corsOptions );
};
    
exports.cors = cors();
exports.corsWithOptions = cors( corsOptionsDelegate );