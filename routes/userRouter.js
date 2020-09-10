/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
var express = require( "express" );
var User = require( "../models/userModel" );
const session = require( "express-session" );
const authenticate = require( "../authenticate" );
const passport = require( "passport" );
var router = express.Router();

router.get( "/" , ( req,res, ) => {
	if( !req.session.user ){
		res.status( 403 );
		res.send( "You must login first" );
		res.redirect( " /" );
	} else {
		res.status( 200 );
		res.send( "Welcome" );
	}
} );

router.post( "/signup", ( req, res, next ) => {
	User.register( { username: req.body.username } , req.body.password, ( err, user ) => {

		if( err ) {
			err.status = 500;
			res.json( { err: err } );

		} else {
		
			User.authenticate( "local" )( req, res, () => {

				res.statusCode = 200;
				res.setHeader( "Content-Type", "application/json" );
				res.json( { status: "Registration Successful!" } );

			} );
		}} );} );
  
router.post( "/login", passport.authenticate( "local" ) ,( req, res, next ) => {
  
	res.status( 200 );
	res.setHeader( "Content-Type", "application/json" );
	res.json( { status: true  , message: "Logged-In Successful!" } );

} );
  
router.get( "/logout", ( req, res, next ) => {
	if ( req.session ) {
	  req.session.destroy();
	  res.clearCookie( "session-id" );
	  res.redirect( "/" );
	}
	else {
	  var err = new Error( "You are not logged in!" );
	  err.status = 403;
	  next( err );
	}
} );

module.exports = router;
