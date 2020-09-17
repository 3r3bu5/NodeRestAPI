/* eslint-disable no-undef */
// requires the model with Passport-Local Mongoose plugged in
// eslint-disable-next-line no-unused-vars
const express =  require( "express" );
const User = require( "./models/userModel" );
const passport = require( "passport" );
const LocalStrategy = require( "passport-local" ).Strategy;
const JwtStrategy = require( "passport-jwt" ).Strategy;
const GitHubStrategy = require( "passport-github" ).Strategy;
const FacebookStrategy = require( "passport-facebook" ).Strategy;
const ExtractJwt = require( "passport-jwt" ).ExtractJwt;
const config = require( "./config" );
var jwt = require( "jsonwebtoken" );

// use static authenticate method of model in LocalStrategy
passport.use( new LocalStrategy( User.authenticate() ) );
 
// use static serialize and deserialize of model for passport session support
passport.serializeUser( User.serializeUser() );
passport.deserializeUser( User.deserializeUser() );

exports.getToken = function( user ) {
	return jwt.sign( user, config.secret,
		{ expiresIn: 36000 } );
};
// jwt options 
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret ;
exports.JWTpassport = passport.use( new JwtStrategy( opts, function( jwt_payload, done ) {
	User.findOne( { _id: jwt_payload._id }, function( err, user ) {
		if ( err ) {
			return done( err, false );
		}
		if ( user ) {
			return done( null, user );
		} else {
			return done( null, false );
		}
	} );
} ) );

exports.verifyUser = passport.authenticate( "jwt", { session: false } );

exports.verifyAdmin = function( req,res,next ){

	if ( req.user.admin === true ) {
		next();
	}
	else{
		res.status( 401 );
		err = new Error( "You are not authorized to perform this operation!" );
		return next( err );
	}

};

exports.facebookPassport = passport.use( new FacebookStrategy( {

	clientID: config.facebook.client_id,
	clientSecret: config.facebook.client_secret,
	callbackURL: config.facebook.callbackURL

} , function( accessToken, refreshToken, profile, done ) {
	User.findOne( { facebookId: profile.id }, function( err, user ) {
		if( err ) {
			console.log( err );  // handle errors!
			done( err,false );
		}
		if ( !err && user !== null ) {
			done( null, user );
		} else {
			user = new User( {
				facebookId: profile.id,
				firstname: profile.name.givenName,
				lastname: profile.name.familyName,
				username: profile.displayName
			} );
			user.save( function( err ) {
				if( err ) {
					console.log( err );  // handle errors!
				} else {
					done( null, user );
				}
			} );
		}
	} );
}
)
);

exports.GitHubPassport = passport.use( new GitHubStrategy( {
	clientID: config.github.client_id,
	clientSecret: config.github.client_secret,
	callbackURL: config.github.callbackURL
}, function( accessToken, refreshToken, profile, done ) {
	User.findOne( { githubId: profile.id }, function( err, user ) {
		if( err ) {
			console.log( err );  // handle errors!
			done( err,false );
		}
		if ( !err && user !== null ) {
			done( null, user );
		} else {
			user = new User( {
				githubId: profile.id,
				fullname: profile.displayName,
				username: profile.username
			} );
			user.save( function( err ) {
				if( err ) {
					done( err,false );  // handle errors!
				} else {
					done( null, user );
				}
			} );
		}
	} );
}

) );