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
			wpnot.action.addSource( 'foo', 'Foo bar', 'http://example.com' )
		),
		{
			foo: {
				id: 'foo',
				name: 'Foo bar',
				url: 'http://example.com'
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
					url: 'http://example.com'
				}
			},
			wpnot.action.addSource( 'moo', 'Moo far', 'http://another.example.com' )
		),
		{
			foo: {
				id: 'foo',
				name: 'Foo bar',
				url: 'http://example.com'
			},
			moo: {
				id: 'moo',
				name: 'Moo far',
				url: 'http://another.example.com'
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
					url: 'http://example.com'
				},
				moo: {
					id: 'moo',
					name: 'Moo far',
					url: 'http://another.example.com'
				}
			},
			wpnot.action.removeSource( 'moo' )
		),
		{
			foo: {
				id: 'foo',
				name: 'Foo bar',
				url: 'http://example.com'
			}
		},
		'Removing source'
	);
} );
