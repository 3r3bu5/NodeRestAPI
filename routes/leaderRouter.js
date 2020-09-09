/* eslint-disable no-undef */
const express =  require( "express" );
const router = express.Router();
const leader = require( "../models/leaderModel" );
router.use( express.json() );

router
	.route( "/" )
	.get( ( req, res,next ) => {
		leader.find( {} )
			.then( ( leaders ) => {
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( leaders );
			} , ( err ) => next( err ) ) 
		
			.catch( ( err ) => next( err ) );
	} )
	.post( ( req, res, next ) => {
		leader.create( req.body )
			.then( ( leader ) => {
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( leader );
			}, ( err ) => next( err )  ) 
		
			.catch( ( err ) => next( err ) );
	} )
	.put( ( req,res )=>{
		res.status( 405 );
		res.send( { message: " PUT method is not allowed on /leaders "  } );
	} )
	.delete( ( req,res,next )=> {
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
	.get( ( req, res, next ) => {
		leader.findById( req.params.id )
			.then( ( leader ) => {

				if( leader != null ){ 
					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( leader );
				} else {
					res.status( 404 );
					// eslint-disable-next-line no-undef
					err = new Error( ` leader Id ${req.params.id} has not been found!` );
					// eslint-disable-next-line no-undef
					return next( err );
				}
				
				
		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( ( req,res )=>{
		res.status( 405 );
		res.send( { message: "POST method is not allowed" } );
	} )
	.put( ( req, res, next ) => {

		leader.findByIdAndUpdate( req.params.id, {
			$set: req.body
			
		}, { new: true } )
			.then( ( leader ) => {

				if( leader != null ) {

					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( leader );
			
				} else {
					res.status( 404 );
					err = new Error( ` leader Id ${req.params.id} has not been found! ` );
					return next( err );
				}
		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.delete( ( req, res, next  ) => {
		
		leader.findByIdAndDelete( req.params.id )
			.then( ( leader ) => {

				if( leader != null ) {

					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( leader );
			
				} else {
					res.status( 404 );
					err = new Error( ` leader Id ${req.params.id} has not been found! ` );
					return next( err );
				}
				
				
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );

	} );
module.exports = router;    