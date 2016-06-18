wpnot.reducer.api = function ( state, action ) {
	if ( state === undefined ) {
		return {
			isFetching: false,
			isError: false,
			updated: null
		};
	}

	switch ( action.type ) {
		case API_REQUEST_NOTIFICATIONS:
			return {
				isFetching: true,
				isError: false,
				updated: null
			};
		case API_ACCEPT_NOTIFICATIONS:
			return {
				isFetching: false,
				isError: false,
				updated: action.date
			};
		case API_ERROR_NOTIFICATIONS:
			return {
				isFetching: false,
				isError: true,
				updated: action.date
			};
	}

	return state;
};
