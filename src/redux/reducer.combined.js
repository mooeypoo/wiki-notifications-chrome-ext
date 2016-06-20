wpnot.reducer.combinedReducer = Redux.combineReducers( {
	list: wpnot.reducer.notifications,
	sources: wpnot.reducer.sources,
	api: wpnot.reducer.api,
	count: wpnot.reducer.count
} );
