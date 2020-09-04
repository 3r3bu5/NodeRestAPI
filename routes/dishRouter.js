const express =  require( "express" );
const Dishes = require( "../models/dishModels" );
const router = express.Router();
router.use( express.json() );

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
	

module.exports = router;    