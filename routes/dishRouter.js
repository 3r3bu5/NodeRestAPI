/* eslint-disable no-undef */
const express =  require( "express" );
const Dishes = require( "../models/dishModels" );
const router = express.Router();
const authenticate = require( "../authenticate" );
router.use( express.json() );


// Routes for all dishes

router
	.route( "/" )
	.get( ( req, res, next ) => {
		Dishes.find( {} )
			.populate( "comments.author" ," -_id -__v -admin" )
			.then( ( dishes ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dishes );

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( authenticate.verifyUser, authenticate.verifyAdmin ,( req, res, next ) => {
		Dishes.create( req.body )
			.then( ( dish ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dish );

	
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.put( authenticate.verifyUser, authenticate.verifyAdmin , ( req, res, )=>{
		res.status( 405 );
		res.send( { message: "PUT method is not allowed" } );
	} )
	.delete( authenticate.verifyUser, authenticate.verifyAdmin ,( req,res, next )=>{
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
			.populate( "comments.author" ," -_id -__v -admin" )
			.then( ( dish ) => {

				res.status( 200 );
				res.setHeader( "Content-Type","application/json" );
				res.json( dish );

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( authenticate.verifyUser, authenticate.verifyAdmin ,( req,res )=>{
		res.status( 405 );
		res.send( { message: "POST method is not allowed" } );
	} )
	.put( authenticate.verifyUser, authenticate.verifyAdmin , ( req, res, next ) => {

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
	.delete( authenticate.verifyUser, authenticate.verifyAdmin , ( req, res, next  ) => {
		
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
			.populate( "comments.author", "-_id -__v -admin" )
			.then( ( dish ) => {
				if( dish != null ){ 
					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( dish.comments );
				} else {
					// eslint-disable-next-line no-undef
					err = new Error( ` Dish Id ${req.params.id} has not found!` );
					// eslint-disable-next-line no-undef
					err.status= 404 ;
					return next( err );
				
				}
				
				
		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( authenticate.verifyUser, ( req, res, next ) => {
		Dishes.findById( req.params.id )
			.then( ( dish ) => {

				if( dish != null ){ 
					req.body.author = req.user._id;
					dish.comments.push( req.body );
					dish.save().then( ( dish ) => {
						Dishes.findById( dish._id )
							.populate( "comments.author" ," -_id -__v -admin" )
							.then( ( dish ) => {
								res.status( 200 );
								res.setHeader( "Content-Type","application/json" );
								res.json( dish );
							} )
						
							.catch( ( err ) => next( err ) );
						
					} ) .catch( ( err ) => next( err ) );
					
				} else {
					// eslint-disable-next-line no-undef
					err = new Error( ` Dish Id ${req.params.id} has not found!` );
					// eslint-disable-next-line no-undef
					err.status= 403 ;
					return next( err );
				}
	
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.put( authenticate.verifyUser, ( req, res, )=>{
		res.status( 405 );
		res.send( { message: "PUT method is not allowed" } );
	} )
	.delete( authenticate.verifyUser , authenticate.verifyAdmin , ( req,res, next )=>{
		Dishes.findById( req.params.id )
			.then( ( dish ) => {

				if( dish != null ){ 
					dish.comments = [];
					dish.save().then( ( dish ) => {
						res.status( 200 );
						res.setHeader( "Content-Type","application/json" );
						res.json( dish );
					} ) .catch( ( err ) => next( err ) );
					
				} else {
					// eslint-disable-next-line no-undef
					err = new Error( ` Dish Id ${req.params.id} has not found!` );
					// eslint-disable-next-line no-undef
					err.status= 404 ;
					return next( err );
				}
	
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} );

// Routes for a specific comment

router
	.route( "/:id/comments/:commentID" )
	.get( ( req, res, next ) => {
		Dishes.findById( req.params.id )
			.populate( "comments.author" ," -__v -admin" )   		
			.then( ( dish ) => {
				var comment = dish.comments.id( req.params.commentID );

				if( dish != null && comment != null ){ 
					res.status( 200 );
					res.setHeader( "Content-Type","application/json" );
					res.json( comment );
				} else if( dish ==null ) {
					// eslint-disable-next-line no-undef
					err = new Error( ` dish Id  ${req.params.id} has not found!` );
					// eslint-disable-next-line no-undef
					err.status= 404 ;
					return next( err );
				} else {
					// eslint-disable-next-line no-undef
					err = new Error( ` comment Id ${req.params.commentID} on dish ${req.params.id} has not found!` );
					err.status= 404 ;
					// eslint-disable-next-line no-undef
					return next( err );
				}
		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.post( authenticate.verifyUser , ( req,res )=>{
		res.status( 405 );
		res.send( { message: "POST method is not allowed" } );
	} )
	.put( authenticate.verifyUser , ( req, res, next ) => {

		Dishes.findById( req.params.id )
			.populate( "comments.author" ,"  -__v -admin" )
			.then( ( dish ) => {

				console.log( req.user.id.toString() );

				var comment = dish.comments.id( req.params.commentID );

				if( dish != null && comment != null ){ 

					
					if ( comment.author._id.toString() == req.user._id.toString() ){

						if ( req.body.rating ){
							comment.rating = req.body.rating;
						}
						if ( req.body.comment ){
							comment.comment = req.body.comment;
						}
	
						// eslint-disable-next-line no-unused-vars
						dish.save().then( ( dish ) => {
							res.status( 200 );
							res.setHeader( "Content-Type","application/json" );
							res.json( comment );
						} ) .catch( ( err ) => next( err ) );

					} else {
						// eslint-disable-next-line no-undef
						err = new Error( " You are not authorized to edit this comment" );
						// eslint-disable-next-line no-undef
						err.status= 404 ;
						return next( err );
					}

					

				} else if( dish == null ) {
					// eslint-disable-next-line no-undef
					err = new Error( ` dish Id  ${req.params.id} has not found!` );
					// eslint-disable-next-line no-undef
					err.status= 404 ;
					return next( err );
				} else {
					
					// eslint-disable-next-line no-undef
					err = new Error( ` comment Id ${req.params.commentID} on dish ${req.params.id} has not found!` );
					// eslint-disable-next-line no-undef
					err.status= 404 ;
					return next( err );
				}

				
		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );
	} )
	.delete( authenticate.verifyUser ,( req, res, next  ) => {
		
		Dishes.findById( req.params.id )
			.then( ( dish ) => {
				var comment = dish.comments.id( req.params.commentID );
				if( dish != null && comment != null ){ 
					if ( comment.author._id.toString() == req.user._id.toString() ){
						dish.comments.id( req.params.commentID ).remove();
				
						dish.save()
							.then( ( dish ) => {
								Dishes.findById( dish._id )
									.populate( "comments.author" ," -_id -__v -admin" )
									.then( ( dish ) => {
										res.statusCode = 200;
										res.setHeader( "Content-Type", "application/json" );
										res.json( dish );  
									} );               
							}, ( err ) => next( err ) );
					}  else {
						// eslint-disable-next-line no-undef
						err = new Error( " You are not authorized to delete this comment" );
						err.status= 403 ;
						// eslint-disable-next-line no-undef
						return next( err );
					} 

				}
				else if( dish ==null ) {
					// eslint-disable-next-line no-undef
					err = new Error( ` dish Id  ${req.params.id} has not found!` );
					err.status= 404 ;
					// eslint-disable-next-line no-undef
					return next( err );
				} else {
					// eslint-disable-next-line no-undef
					err = new Error( ` comment Id ${req.params.commentID} on dish ${req.params.id} has not found!` );
					// eslint-disable-next-line no-undef
					err.status= 404 ;
					return next( err );
				}
				
				

		
			}, ( err ) => next( err ) 
			)
			.catch( ( err ) => next( err ) );

	} );


	

module.exports = router;    