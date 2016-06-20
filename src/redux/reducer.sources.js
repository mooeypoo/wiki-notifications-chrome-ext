wpnot.reducer.sources = function ( state, action ) {
	var newState, source;

	if ( state === undefined ) {
		return {};
	}

	switch ( action.type ) {
		case ADD_SOURCE:
			newState = Object.assign( {}, state );
			newState[ action.data.id ] = {
				id: action.data.id,
				name: action.data.name,
				url: action.data.url,
				base: action.data.base
			};

			return newState;
		case REMOVE_SOURCE:
			newState = {};
			for ( source in state ) {
				if ( source !== action.id ) {
					newState[ source ] = state[ source ];
				}
			}

			return newState;
	}

	return state;
};

