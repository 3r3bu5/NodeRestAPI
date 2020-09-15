/* eslint-disable no-undef */
const express =  require( "express" );
const router = express.Router();
const promo = require( "../models/promoModel" );
const authenticate = require( "../authenticate" );
const cors = require( "../cors" );
router.use( express.json() );

router
	.route( "/" )
	.options( cors.corsWithOptions, ( req,res ) => { res.status( 200 ); } )
	.get( cors.cors, ( req, res,next ) => {
		promo.find( {} )
			.then( ( promos ) => {
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( promos );
			} , ( err ) => next( err ) ) 
		
			.catch( ( err ) => next( err ) );
	} )
	.post( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, ( req, res, next ) => {
		promo.create( req.body )
			.then( ( promo ) => {
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( promo );
			}, ( err ) => next( err )  ) 
		
			.catch( ( err ) => next( err ) );
	} )
	.put( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,( req,res )=>{
		res.status( 405 );
		res.send( { message: " PUT method is not allowed on /promotions "  } );
	} )
	.delete( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,( req,res,next )=> {
		promo.remove()
			// eslint-disable-next-line no-unused-vars
			.then( ( promos ) => {
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( { message: "Deleted all promotions " } );
			} , ( err ) => next( err ) ) 
		
			.catch( ( err ) => next( err ) );
	} );

router
	.route( "/:id" )
	.options( cors.corsWithOptions, ( req,res ) => { res.status( 200 ); } )
	.get( cors.cors, ( req, res, next ) => {
		promo.findById( req.params.id )
			.then( ( promo ) => {

				if( promo != null ){ 
					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( promo );
				} else {
					res.status( 404 );
					// eslint-disable-next-line no-undef
					err = new Error( ` Promotion Id ${req.params.id} has not been found!` );
					// eslint-disable-next-line no-undef
					return next( err );
				}
				
				
		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, ( req,res )=>{
		res.status( 405 );
		res.send( { message: "POST method is not allowed" } );
	} )
	.put( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, ( req, res, next ) => {

		promo.findByIdAndUpdate( req.params.id, {
			$set: req.body
			
		}, { new: true } )
			.then( ( promo ) => {

				if( promo != null ) {

					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( promo );
			
				} else {
					res.status( 404 );
					err = new Error( ` Promotion Id ${req.params.id} has not been found! ` );
					return next( err );
				}
		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.delete( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, ( req, res, next  ) => {
		
		promo.findByIdAndDelete( req.params.id )
			.then( ( promo ) => {

				if( promo != null ) {

					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( promo );
			
				} else {
					res.status( 404 );
					err = new Error( ` Promotion Id ${req.params.id} has not been found! ` );
					return next( err );
				}
				
				
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );

	} );
module.exports = router;    