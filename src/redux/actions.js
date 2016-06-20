wpnot.action = {
	/**
	 * Mark as read action in a single wiki
	 *
	 * @param {string} wikiName Name of the wiki
	 * @param {string} id Notification id
	 * @return {Object} Action
	 */
	markRead: function ( wikiName, id ) {
		var wikiIdList = {};

		return function ( dispatch ) {
			dispatch( wpnot.action.markReadInModel( wikiName, id ) );
			dispatch( wpnot.action.markReadInAPI( wikiName, id ) );
		};
	},

	/**
	 * Mark notification as read in the API.
	 * This action should not be called directly.
	 * Please see #markRead
	 *
	 * @private
	 * @param {string} wikiName Name of the wiki
	 * @param {string} id An array of IDs
	 * @return {Object} Action
	 */
	markReadInAPI: function ( wikiName, id ) {
		return function ( dispatch, getState ) {
			var sources = getState().sources;

			// Get the API access point of this wiki
			url = sources[ wikiName ] && sources[ wikiName ].url;
			if ( !url ) {
				url = CONFIG_WIKI_URL;
			}

			return $.ajax( {
				url: url,
				dataType: 'json',
				data: {
					action: 'echomarkread',
					list: id
				}
			} );
		};
	},

	/**
	 * Mark item as read in the state model.
	 * This action should not be called directly.
	 * Please see #markRead
	 *
	 * @private
	 * @param {string} wikiName Name of the wiki
	 * @param {string|string[]} ids An array of IDs
	 * @return {Object} Action
	 */
	markReadInModel: function ( wikiName, ids ) {
		var wikiIdList = {};

		ids = Array.isArray( ids ) ? ids : [ ids ];

		wikiIdList[ wikiName ] = ids;
		return {
			type: MARK_READ,
			wikiIds: wikiIdList
		};
	},

	/**
	 * Update the count
	 *
	 * @param {number} count Notification count
	 * @return {Object} Action
	 */
	updateCount: function ( count ) {
		return {
			type: UPDATE_COUNT,
			count: count
		};
	},

	/**
	 * Get current notification count from the API
	 *
	 * @return {Object} Action
	 */
	getNotificationCount: function () {
		return function ( dispatch ) {
			return $.ajax( {
				url: CONFIG_WIKI_URL,
				dataType: 'json',
				data: {
					action: 'query',
					format: 'json',
					meta: 'notifications',
					notprop: 'count',
					bundle: false,
				}
			} )
			.then( function ( data ) {
				dispatch( wpnot.action.updateCount( data.query.notifications.rawcount ) );
			} );
		};
	},

	/**
	 * Populate notification list from an object
	 *
	 * @param {Object[]} list Object array to populate from
	 * @return {Object} Action
	 */
	populateFromObject: function ( list ) {
		return {
			type: POPULATE_FROM_OBJECT,
			list: list
		};
	},

	/**
	 * Add source
	 *
	 * @param {string} sourceId Source ID
	 * @param {string} sourceName Source display name
	 * @param {string} sourceBase Base URL for articles
	 * @param {string} sourceUrl Access point for API
	 * @return {Object} Action
	 */
	addSource: function ( sourceId, sourceName, sourceBase, sourceUrl ) {
		return {
			type: ADD_SOURCE,
			data: {
				id: sourceId,
				name: sourceName,
				base: sourceBase,
				url: sourceUrl
			}
		};
	},

	/**
	 * Remove a source
	 *
	 * @param {string} sourceId Source ID
	 * @return {Object} Action
	 */
	removeSource: function ( sourceId ) {
		return {
			type: REMOVE_SOURCE,
			id: sourceId
		};
	},

	/**
	 * Fetch notifications list
	 *
	 * @return {Function} Thunk function
	 */
	fetchNotifications: function () {
		return function ( dispatch ) {
			// Update state to say we are updating the API
			dispatch( wpnot.action.startFetchNotifications() );

			return dispatch( wpnot.action.fetchNotificationsFromAPI() )
				.then( function ( list ) {
					dispatch( wpnot.action.populateFromObject( list ) );
					dispatch( wpnot.action.endFetchNotifications() );
				} );

		};
	},

	/**
	 * Fetch notifications from given source wikis
	 * This action should not be called directly.
	 * Please see #fetchNotifications
	 *
	 * @private
	 * @param {string[]} sources An array of sources
	 * @param {Object[]} list List that contains local notifications
	 * @return {Function} Thunk function
	 */
	fetchFromSources: function ( sources, list ) {
		return function ( dispatch ) {
			// We start by calling 'local' notifications
			return dispatch( wpnot.action.fetchNotificationsFromAPI( sources ) )
				.then( function ( foreignList ) {
					// Concatenate both lists
					return list.concat( foreignList );
				} );
		};
	},

	/**
	 * Get notifications from the server.
	 * This action should not be called directly.
	 * Please see #fetchNotifications
	 *
	 * @private
	 * @param {string} [wiki] Wiki name
	 * @return {Function} Thunk function
	 */
	fetchNotificationsFromAPI: function ( wikis ) {
		var params = {
				action: 'query',
				format: 'json',
				uselang: 'en',
				meta: 'notifications',
				notfilter: '!read',
				notprop: 'list',
				notformat: 'model',
				bundle: false,
				notlimit: 10,
			};

		if ( wikis ) {
			wikis = Array.isArray( wikis ) ? wikis : [ wikis ];
			params.notwikis = wikis.join( '|' );
		} else {
			params.notcrosswikisummary = 1;
		}

		return function ( dispatch ) {
			return $.ajax( {
				url: CONFIG_WIKI_URL,
				dataType: 'json',
				data: params
			} )
			.then(
				// Success
				function ( data ) {
					var i,
						sources = [],
						newList = [],
						list = data.query.notifications.list;

					for ( i = 0; i < list.length; i++ ) {
						if ( list[ i ].id < 0 ) {
							// This is a cross-wiki notification
							// Add source information
							for ( source in list[ i ].sources ) {
								dispatch( wpnot.action.addSource(
									// source ID
									source,
									// sourceName
									list[ i ].sources[ source ].title,
									// sourceBase
									list[ i ].sources[ source ].base,
									// sourceUrl
									list[ i ].sources[ source ].url
								) );

								sources.push( source );
							}

						} else {
							newList.push( list[ i ] );
						}
					}

					if ( sources.length ) {
						// This is another promise that will fetch notifications
						// from the API and join them with the given list
						return dispatch( wpnot.action.fetchFromSources( sources, newList ) );
					}
					return newList;
				},
				// Failure
				function () {
					dispatch( wpnot.action.errorFetchNotifications() );
				}
			);
		};
	},

	/**
	 * Flag the start of fetch notifications
	 *
	 * @return {Object} Action
	 */
	startFetchNotifications: function () {
		return {
			type: API_REQUEST_NOTIFICATIONS
		};
	},

	/**
	 * Flag the end of fetch notifications
	 *
	 * @return {Object} Action
	 */
	endFetchNotifications: function () {
		return {
			type: API_ACCEPT_NOTIFICATIONS,
			date: Date.now()
		};
	},

	/**
	 * Flag an error of fetch notifications
	 *
	 * @return {Object} Action
	 */
	errorFetchNotifications: function () {
		return {
			type: API_ERROR_NOTIFICATIONS,
			date: Date.now()
		};
	}
};
