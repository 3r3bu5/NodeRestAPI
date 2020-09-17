const express =  require( "express" );
const router = express.Router();
const favorites = require( "../models/favourites" );
const Dishes = require( "../models/dishModels" );
const authenticate = require( "../authenticate" );
const cors = require( "../cors" );
router.use( express.json() );

router
	.route( "/" )
	.options( cors.corsWithOptions, ( req,res ) => { res.status( 200 ); } )

	.get( cors.cors ,authenticate.verifyUser, ( req, res,next ) => {
		favorites.findOne( { "author": req.user._id } )
			.populate( "dishes" )
			.populate( "author" )
			.then( ( favorites ) => {
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( favorites );
			} , ( err ) => next( err ) ) 
		
			.catch( ( err ) => next( err ) );
	} )
	.post( cors.corsWithOptions, authenticate.verifyUser, ( req, res, next ) => {
		Dishes.findById( req.body.dishes )
		// sql query has been performed
			.then( ( dish ) => {
				// see if the that specific dish exists

				if ( dish != null )
				{	
					
					favorites.findOne( { "author": req.user._id } )
						.then( ( fav ) => {
							// see if user has favorites record
							if( fav != null ){					
								req.body.author = req.user._id.toString();
								console.log( req.body.dishes.length );
								for ( var i=0; i < req.body.dishes.length; i++  ){
									if( fav.dishes.includes( req.body.dishes[i] ) ){
										continue;
									}
									else {
										fav.dishes.push( req.body.dishes[i] );
									}}	
									
								fav.save()
									.then( ( favorites ) => {										
										res.status( 200 );
										res.setHeader( "Content-Type","application/json" );
										res.json( favorites );
									} )
									.catch( ( err ) => next( err ) );}
							// create a favourite record
							else {
								req.body.author = req.user._id.toString();
								console.log( req.body );
								favorites.create( req.body )		
									.then( ( favorites ) => {
										res.status( 201 );
										res.setHeader( "Content-Type","application/json" );
										res.json( favorites );
									} )
									.catch( ( err ) => next( err ) );
							}

						} )
						.catch( ( err ) => next( err ) );
					

				} else {
					err = new Error( "Dish Id doenst exist" );
					err.status = 404;
					return next( err );
				} } )
			.catch( ( err ) => next( err ) );
	
	} )
	
		
	.put( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,( req,res )=>{
		res.status( 405 );
		res.send( { message: " PUT method is not allowed on /favourites "  } );
	} )
	.delete( cors.corsWithOptions, authenticate.verifyUser,( req,res,next )=> {					
		favorites.findOneAndDelete( { "author": req.user._id } )
			.then( ( fav ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( { message: "Deleted all favorites " } );
			} , ( err ) => next( err ) ) 
		
			.catch( ( err ) => next( err ) );
	} );


router
	.route( "/:dishId" )
	.options( cors.corsWithOptions, ( req,res ) => { res.status( 200 ); } )

	.get( cors.cors ,authenticate.verifyUser, ( req, res ) => {
		res.status( 405 );
		res.send( { message: " GET method is not allowed on /favourites/dishId "  } );
	} )
	.post( cors.corsWithOptions, authenticate.verifyUser, ( req, res, next ) => {
		Dishes.findById( req.params.dishId )
		// sql query has been performed
			.then( ( dish ) => {
				// see if the that specific dish exists

				if ( dish != null )
				{	
					
					favorites.findOne( { "author": req.user._id } )
						.then( ( fav ) => {
							// see if user has favorites record
							if( fav != null ){					
								req.body.author = req.user._id.toString();
								
								if( fav.dishes.includes( req.params.dishId ) ){
									res.status( 500 );
									res.setHeader( "Content-Type","application/json" );
									res.json( { message: "This dish is already in your favourites" } );
								}
								else {
									fav.dishes.push( req.params.dishId );
											
									fav.save()
										.then( ( favorites ) => {										
											res.status( 200 );
											res.setHeader( "Content-Type","application/json" );
											res.json( favorites );
										} )
										.catch( ( err ) => next( err ) );}
							}
							
							// create a favourite record
							else {
								req.body.author = req.user._id.toString();
								console.log( req.body );
								favorites.create( { dishes: req.params.dishId , author: req.body.author } )		
									.then( ( favorites ) => {
										res.status( 201 );
										res.setHeader( "Content-Type","application/json" );
										res.json( favorites );
									} )
									.catch( ( err ) => next( err ) );
							}

						} )
						.catch( ( err ) => next( err ) );
					

				} else {
					err = new Error( "Dish Id doenst exist" );
					err.status = 404;
					return next( err );
				} } )

			.catch( ( err ) => next( err ) );
	
	} )
	
		
	.put( cors.corsWithOptions, authenticate.verifyUser, ( req,res )=>{
		res.status( 405 );
		res.send( { message: " PUT method is not allowed on /favourites/dishId "  } );
	} )
	.delete( cors.corsWithOptions, authenticate.verifyUser,( req,res,next )=> {	
		// find dish first			
		Dishes.findById( req.params.dishId )
			// sql query has been performed
			.then( ( dish ) => {
				// see if the that specific dish exists
				if ( dish == null ){

					res.status( 404 );
					res.setHeader( "Content-Type","application/json" );
					res.json( { message: "This Id does not exist " } );

				} else {

					favorites.findOne( { "author": req.user._id } )

						.then( ( fav ) => {

					
							console.log( fav.dishes );
							console.log( fav.dishes.splice( fav.dishes.indexOf( req.params.dishId ) , 1 ) );
							fav.save()
								.then ( ( fav ) => {
									res.status( 200 );
									res.setHeader( "Content-Type","application/json" );
									res.json(  fav );
								} )
								.catch( ( err ) => next( err ) );

						} ) .catch( ( err ) => next( err ) );

				}} ).catch( ( err ) => next( err ) );
	} );
			
				
	


module.exports = router;
