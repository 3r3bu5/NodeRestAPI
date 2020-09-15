/* eslint-disable no-undef */
const express =  require( "express" );
const router = express.Router();
const leader = require( "../models/leaderModel" );
const authenticate = require( "../authenticate" );
const cors = require( "../cors" );
router.use( express.json() );

router
	.route( "/" )
	.options( cors.corsWithOptions, ( req,res ) => { res.status( 200 ); } )

	.get( cors.cors , ( req, res,next ) => {
		leader.find( {} )
			.then( ( leaders ) => {
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( leaders );
			} , ( err ) => next( err ) ) 
		
			.catch( ( err ) => next( err ) );
	} )
	.post( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, ( req, res, next ) => {
		leader.create( req.body )
			.then( ( leader ) => {
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( leader );
			}, ( err ) => next( err )  ) 
		
			.catch( ( err ) => next( err ) );
	} )
	.put( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,( req,res )=>{
		res.status( 405 );
		res.send( { message: " PUT method is not allowed on /leaders "  } );
	} )
	.delete( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,( req,res,next )=> {
		leader.remove()
			// eslint-disable-next-line no-unused-vars
			.then( ( leaders ) => {
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( { message: "Deleted all leaders " } );
			} , ( err ) => next( err ) ) 
		
			.catch( ( err ) => next( err ) );
	} );

router
	.route( "/:id" )
	.options( cors.corsWithOptions, ( req,res ) => { res.status( 200 ); } )
	.get( cors.cors , ( req, res, next ) => {
		leader.findById( req.params.id )
			.then( ( leader ) => {

				if( leader != null ){ 
					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( leader );
				} else {
					// eslint-disable-next-line no-undef
					err = new Error( ` leader Id ${req.params.id} has not been found!` );
					// eslint-disable-next-line no-undef
					err.status= 404 ;
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

		leader.findByIdAndUpdate( req.params.id, {
			$set: req.body
			
		}, { new: true } )
			.then( ( leader ) => {

				if( leader != null ) {

					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( leader );
			
				} else {
					err = new Error( ` leader Id ${req.params.id} has not been found! ` );
					err.status= 404 ;
					return next( err );
				}
		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.delete( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, ( req, res, next  ) => {
		
		leader.findByIdAndDelete( req.params.id )
			.then( ( leader ) => {

				if( leader != null ) {

					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( leader );
			
				} else {
					err = new Error( ` leader Id ${req.params.id} has not been found! ` );
					err.status= 404 ;
					return next( err );
				}
				
				
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );

	} );
module.exports = router;    