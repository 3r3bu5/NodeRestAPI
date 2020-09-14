/* eslint-disable no-unused-vars */
const createError = require( "http-errors" );
const express = require( "express" );
const path = require( "path" );
const cookieParser = require( "cookie-parser" );
const logger = require( "morgan" );
const config = require( "./config" );
const mongoose = require( "mongoose" );
const session = require( "express-session" );
const FileStore = require( "session-file-store" )( session );
const passport = require( "passport" );


// Routers
const indexRouter = require( "./routes/index" );
const usersRouter = require( "./routes/userRouter" );
const dishRouter = require( "./routes/dishRouter" );
const promoRouter = require( "./routes/promoRouter" );
const leaderRouter = require( "./routes/leaderRouter" );
const uploadRouter = require( "./routes/uploadRouter" );


// express app
const app = express();

// allow only https requests
app.all( "*", ( req, res, next ) => {
	if ( req.secure ) {
		return next();
	}
	else {
		res.redirect( 307, "https://" + req.hostname + ":" + app.get( "secPort" ) + req.url );
	}
} );

// DB connection
const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect( url );
connect
	// eslint-disable-next-line no-unused-vars
	.then( ( db ) => {
		console.log( "Connected to server correctly" );
	},( err ) => { console.log( err ); } );

// view engine setup
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use( logger( "dev" ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
//app.use( cookieParser( "MrbOOMbASTIC" ) );


app.use( passport.initialize() );
app.use( passport.session() );

app.use( "/", indexRouter );
app.use( "/users", usersRouter );


app.use( express.static( path.join( __dirname, "public" ) ) );


app.use( "/dishes",dishRouter );
app.use( "/promotions",promoRouter );
app.use( "/leaders",leaderRouter );
app.use( "/imageUpload",uploadRouter );


// catch 404 and forward to error handler
app.use( function( req, res, next ) {
	next( createError( 404 ) );
} );

// error handler
app.use( function( err, req, res, next ) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get( "env" ) === "development" ? err : {};

	// render the error page
	res.status( err.status || 500 );
	res.render( "error" );
} );

module.exports = app;
