QUnit.test( "Sources reducer", function( assert ) {

	// Initial state
	assert.deepEqual(
		wpnot.reducer.sources(),
		{},
		'Initial state'
	);

	assert.deepEqual(
		wpnot.reducer.sources(
			{},
			wpnot.action.addSource( 'foo', 'Foo bar', 'http://example.com', 'http://example.com/api.php' )
		),
		{
			foo: {
				id: 'foo',
				name: 'Foo bar',
				base: 'http://example.com',
				url: 'http://example.com/api.php'
			}
		},
		'Adding source'
	);

	assert.deepEqual(
		wpnot.reducer.sources(
			{
				foo: {
					id: 'foo',
					name: 'Foo bar',
					base: 'http://example.com',
					url: 'http://example.com/api.php'
				}
			},
			wpnot.action.addSource( 'moo', 'Moo far', 'http://another.example.com', 'http://another.example.com/api.php' )
		),
		{
			foo: {
				id: 'foo',
				name: 'Foo bar',
				base: 'http://example.com',
				url: 'http://example.com/api.php'
			},
			moo: {
				id: 'moo',
				name: 'Moo far',
				base: 'http://another.example.com',
				url: 'http://another.example.com/api.php'
			}
		},
		'Adding second source'
	);

	// Remove source
	assert.deepEqual(
		wpnot.reducer.sources(
			{
				foo: {
					id: 'foo',
					name: 'Foo bar',
					base: 'http://example.com',
					url: 'http://example.com/api.php'
				},
				moo: {
					id: 'moo',
					name: 'Moo far',
					base: 'http://another.example.com',
					url: 'http://another.example.com/api.php'
				}
			},
			wpnot.action.removeSource( 'moo' )
		),
		{
			foo: {
				id: 'foo',
				name: 'Foo bar',
				base: 'http://example.com',
				url: 'http://example.com/api.php'
			}
		},
		'Removing source'
	);
} );
