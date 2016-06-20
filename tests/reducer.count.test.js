QUnit.test( "Count reducer", function( assert ) {

	// Initial state
	assert.deepEqual(
		wpnot.reducer.count(),
		0,
		'Initial state'
	);

	assert.deepEqual(
		wpnot.reducer.count(
			0,
			wpnot.action.updateCount( 10 )
		),
		10,
		'Set count'
	);

} );
