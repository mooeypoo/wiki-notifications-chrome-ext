wpnot.action = {
	/**
	 * Mark as read action in a single wiki
	 *
	 * @param {string} wikiName Name of the wiki
	 * @param {string|string[]} ids An array of IDs
	 * @return {Object} Action
	 */
	markReadInWiki: function ( wikiName, ids ) {
		var wikiIdList = {};

		ids = Array.isArray( ids ) ? ids : [ ids ];

		wikiIdList[ wikiName ] = ids;
		return {
			type: MARK_READ,
			wikiIds: wikiIdList
		};
	},

	/**
	 * Mark as read action in multiple wikis
	 *
	 * @param {Object} wikiIdList An object representing
	 *  wikis with the list of the IDs to be marked as read.
	 * @return {Object} Action
	 */
	markRead: function ( wikiIdList ) {
		return {
			type: MARK_READ,
			wikiIds: wikiIdList
		};
	},

	/**
	 * Populate notification list from an object
	 *
	 * @param {[type]} obj Object to populate from
	 * @return {Object} Action
	 */
	populateFromObject: function ( obj ) {
		return {
			type: POPULATE_FROM_OBJECT,
			data: obj
		};
	},

	addSource: function ( sourceId, sourceName, sourceUrl ) {
		return {
			type: ADD_SOURCE,
			data: {
				id: sourceId,
				name: sourceName,
				url: sourceUrl
			}
		};
	},

	removeSource: function ( sourceId ) {
		return {
			type: REMOVE_SOURCE,
			id: sourceId
		};
	},

	/* API */

	/**
	 * Get notifications from the server.
	 *
	 * @param {string} [wiki] Wiki name
	 * @return {Function} Thunk function
	 */
	fetchNotifications: function ( wikis ) {
		var params = {
				action: 'query',
				format: 'json',
				uselang: 'en',
				meta: 'notifications',
				notfilter: '!read',
				notprop: 'list',
				notformat: 'model',
				notlimit: 10,
			};

		if ( wikis ) {
			wikis = Array.isArray( wikis ) ? wikis : [ wikis ];
			params.notwikis = wikis.join( '|' );
		} else {
			params.notcrosswikisummary = 1;
		}

		return function ( dispatch ) {
			// Update state to say we are updating the API
			dispatch( wpnot.action.startFetchNotifications( wikis ) );

			return $.ajax( {
				url: CONFIG_WIKI_URL,
				dataType: 'json',
				data: params
			} )
			.then(
				// Success
				function ( data ) {
					return data.query.notifications.list;
				},
				// Failure
				function () {
					dispatch( wpnot.action.errorFetchNotifications( wikis ) );
				}
			)
			.then( function () {
				dispatch( wpnot.action.populateFromObject() );
				dispatch( wpnot.action.endFetchNotifications( wikis ) );
			} )
		};
	},

	startFetchNotifications: function ( wiki ) {
		return {
			type: API_REQUEST_NOTIFICATIONS
		}
	},
	endFetchNotifications: function ( wiki ) {
		return {
			type: API_ACCEPT_NOTIFICATIONS,
			date: Date.now()
		}
	},
	errorFetchNotifications: function ( wiki ) {
		return {
			type: API_ERROR_NOTIFICATIONS,
			date: Date.now()
		}
	}

};
