/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
var express = require( "express" );
var User = require( "../models/userModel" );
const session = require( "express-session" );
const authenticate = require( "../authenticate" );
const cors = require( "../cors" );
const passport = require( "passport" );
var router = express.Router();

router
	.options( cors.corsWithOptions, ( req,res ) => { res.status( 200 ); } )
	.get( "/" , cors.cors , authenticate.verifyUser, authenticate.verifyAdmin ,( req,res,next ) => {

		User.find( {} )
			.then( ( users )  => {
				res.json( users );
			} )
			.catch( ( err ) => next( err ) );
	
	} );

router.post( "/signup", cors.corsWithOptions, ( req, res, next ) => {
	User.register( new User( { username: req.body.username } ), 
	  req.body.password, ( err, user ) => {
	  if( err ) {
				res.statusCode = 500;
				res.setHeader( "Content-Type", "application/json" );
				res.json( { err: err } );
	  }
	  else {
				if ( req.body.firstname )
		 			user.firstname = req.body.firstname;
				if ( req.body.lastname )
		 		 	user.lastname = req.body.lastname;
				user.save( ( err, user ) => {
		  		if ( err ) {
						res.statusCode = 500;
						res.setHeader( "Content-Type", "application/json" );
						res.json( { err: err } );
						return ;
		  }
		  passport.authenticate( "local" )( req, res, () => {
						res.statusCode = 200;
						res.setHeader( "Content-Type", "application/json" );
						res.json( { success: true, status: "Registration Successful!" } );
		  } );
				} );
	  }
		} );
} );
  
  
router.post( "/login", cors.corsWithOptions, passport.authenticate( "local" ) ,( req, res, next ) => {
   
	var token = authenticate.getToken( { _id: req.user._id } );
	res.status( 200 );
	res.setHeader( "Content-Type", "application/json" );
	res.json( { status: true  , token: token , message: "Logged-In Successful!" } );

} );
  
router.get( "/logout", cors.cors , ( req, res, next ) => {
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
router.get( "/facebook/token", cors.cors, passport.authenticate( "facebook" ) ,( req, res, next ) => { 
	res.status( 200 );
} );

router.get( "/facebook/callback", cors.cors, passport.authenticate( "facebook" ) ,( req, res, next ) => {
   
	if ( req.user ) {
		var token = authenticate.getToken( { _id: req.user._id } );
		res.statusCode = 200;
		res.setHeader( "Content-Type", "application/json" );
		res.json( { success: true, token: token, status: "You are successfully logged in!" } );
	  }
} );

router.get( "/github/token", cors.cors, passport.authenticate( "github" ) ,( req, res, next ) => { 
	res.status( 200 );
} );

router.get( "/github/callback", cors.cors, passport.authenticate( "github" ) ,( req, res, next ) => {
   
	if ( req.user ) {
		var token = authenticate.getToken( { _id: req.user._id } );
		res.statusCode = 200;
		res.setHeader( "Content-Type", "application/json" );
		res.json( { success: true, token: token, status: "You are successfully logged in!" } );
	  }
} );
module.exports = router;
