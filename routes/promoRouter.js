const express =  require( "express" );
const router = express.Router();
router.use( express.json() );

router
	.route( "/" )
	.get( ( req, res ) => {
		res.send( { message: "Get all promotions" } );
	} )
	.post( ( req, res ) => {
		res.send( { message: "added a new promotion",
			name: req.body.name,
			desc: req.body.desc
		} ); 
	} )
	.put( ( req,res )=>{
		res.status( 405 );
		res.send( { message: "PUT method is not allowed" } );
	} )
	.delete( ( req,res )=>{
		res.status( 403 );
		res.send( { message: "You are not authorized to perform this operation!" } );
	} );

router
	.route( "/:id" )
	.get( ( req, res ) => {
		res.send( { message: ` Get a promotion ID ${req.params.id}` } );
	} )
	.put( ( req, res ) => {
		res.send( {  message: ` update a promotion ID ${req.params.id}`,
			name: req.body.name,
			desc: req.body.desc
		} );
	} )
	.delete( ( req, res ) => {
		res.send( { message: ` deleted a promotion ID ${req.params.id}` } );
	} )
	.post( ( req,res )=>{
		res.status( 405 );
		res.send( { message: "POST method is not allowed" } );
	} );
module.exports = router;    