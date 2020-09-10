/* eslint-disable no-unused-vars */
const createError = require( "http-errors" );
const express = require( "express" );
const path = require( "path" );
const cookieParser = require( "cookie-parser" );
const logger = require( "morgan" );
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

// express app
const app = express();

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

app.use( session( {
	name: "session_Id",
	secret: "MrbOOMbASTIC",
	saveUninitialized: false,
	resave: false,
	store: new FileStore()

} ) );
app.use( passport.initialize() );
app.use( passport.session() );

app.use( "/", indexRouter );
app.use( "/users", usersRouter );

function auth ( req, res, next ) {
	console.log( req.session );

	if( !req.user ) {
		var err = new Error( "You are not authenticated!" );
		err.status = 403;
		return next( err );
	}
	else {
		next();
	}
}
app.use( auth );
app.use( express.static( path.join( __dirname, "public" ) ) );


app.use( "/dishes",dishRouter );
app.use( "/promotions",promoRouter );
app.use( "/leaders",leaderRouter );

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
