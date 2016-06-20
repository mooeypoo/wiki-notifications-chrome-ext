wpnot.reducer.count = function ( state, action ) {
	if ( state === undefined ) {
		return 0;
	}

	switch ( action.type ) {
		case UPDATE_COUNT:
			return action.count;
	}

	return state;
};

