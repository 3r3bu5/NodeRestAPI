const express =  require( "express" );
const Dishes = require( "../models/dishModels" );
const router = express.Router();
router.use( express.json() );


// Routes for all dishes

router
	.route( "/" )
	.get( ( req, res, next ) => {
		Dishes.find( {} )
			.then( ( dishes ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dishes );

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( ( req, res, next ) => {
		Dishes.create( req.body )
			.then( ( dish ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dish );

	
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.put( ( req, res, )=>{
		res.status( 405 );
		res.send( { message: "PUT method is not allowed" } );
	} )
	.delete( ( req,res, next )=>{
		Dishes.remove( req.body )
			.then( ( dishes ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dishes );

	
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} );

// Routes for specific dish

router
	.route( "/:id" )
	.get( ( req, res, next ) => {
		Dishes.findById( req.params.id )
			.then( ( dish ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dish );

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( ( req,res )=>{
		res.status( 405 );
		res.send( { message: "POST method is not allowed" } );
	} )
	.put( ( req, res, next ) => {

		Dishes.findByIdAndUpdate( req.params.id, {
			$set: req.body
			
		}, { new: true } )
			.then( ( dish ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dish );

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.delete( ( req, res, next  ) => {
		
		Dishes.findByIdAndDelete( req.params.id )
			.then( ( dish ) => {

				console.log( ` Deleted a dish ID ${req.params.id} ` );
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dish );

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );

	} );

// Routes for for all dish comments 

router
	.route( "/:id/comments/" )
	.get( ( req, res, next ) => {
		Dishes.findById( req.params.id )
			.then( ( dishes ) => {
				console.log( "Maybe found?" );
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dishes.comments );

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( ( req, res, next ) => {
		Dishes.findById( req.params.id )
			.then( ( dish ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				dish.comments.push( req.body );
				dish.save();
				res.json( dish );

	
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.put( ( req, res, )=>{
		res.status( 405 );
		res.send( { message: "PUT method is not allowed" } );
	} )
	.delete( ( req,res, next )=>{
		Dishes.findById( req.params.id )
			.then( ( dish ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				// eslint-disable-next-line for-direction
				dish.comments = [];
				dish.save();

				res.json( dish );

	
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} );

// Routes for a specific comment

router
	.route( "/:id/comments/:commentID" )
	.get( ( req, res, next ) => {
		Dishes.findById( req.params.id )
			.then( ( dish ) => {

				var comment = dish.comments.id( req.params.commentID );
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( comment );

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( ( req,res )=>{
		res.status( 405 );
		res.send( { message: "POST method is not allowed" } );
	} )
	.put( ( req, res, next ) => {

		Dishes.findById( req.params.id )
			.then( ( dish ) => {

				var comment = dish.comments.id( req.params.commentID );
				comment.set( req.body );
				dish.save();
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( comment );
		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.delete( ( req, res, next  ) => {
		
		Dishes.findById( req.params.id )
			.then( ( dish ) => {
				
				dish.comments.id( req.params.commentID ).remove();
				dish.save();
				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( { message: "Deleted the dish comment" } );

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );

	} );


	

module.exports = router;    