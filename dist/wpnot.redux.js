var wpnot = {
	helper: {},
	reducer: {},
	action: {}
};

var POPULATE_FROM_OBJECT = 'populateNotificationsFromObject';
var POPULATE_FROM_API = 'populateNotificationsFromAPI';

var PROCESS_NOTIFICATIONS = 'processNotifications';

var API_REQUEST_NOTIFICATIONS = 'ApiRequestNotifications';
var API_ACCEPT_NOTIFICATIONS = 'ApiAcceptNotifications';
var API_ERROR_NOTIFICATIONS = 'ApiErrorNotifications';

var MARK_READ = 'markNotificationsRead';
var MARK_UNREAD = 'markNotificationsUnread';

var ADD_SOURCE = 'addSource';
var REMOVE_SOURCE = 'removeSource';

var CONFIG_WIKI_URL = 'http://dev.wiki.local.wmftest.net:8080/w/api.php'

wpnot.helper = {
	/**
	 * A method taking in raw notification data that is accepted
	 * from the MediaWiki API and returns a sanitized data object
	 * representing the notification for our state.
	 *
	 * @param {Object} data Original notification data
	 * @return {Object} Sanitized notification state presentation
	 */
	sanitizeNotificationData: function ( data ) {
		return {
			id: data.id,
			wiki: data.wiki,
			timestamp: {
				unix: data.timestamp.utcunix,
				human: data.timestamp.date
			},
			text: {
				header: data[ '*' ].header,
				body: data[ '*' ].body,
			},
			link: {
				url: data[ '*' ].links.primary.url,
				label: data[ '*' ].links.primary.label
			}
		};
	},

	/**
	 * Check whether the notification data given is in the
	 * list of wiki ids.
	 *
	 * @param {Object[]} data Notification data
	 * @param {Object} wikiIds An object defining wikis and their
	 *  ids. It should be in the form:
	 *  {
	 *  	wikiName: [ id1, id2, id3... ]
	 *  }
	 * @return {boolean} Item exists in the object list
	 */
	isNotificationInWikiId: function ( data, wikiIds ) {
		return wikiIds[ data.wiki ] &&
			wikiIds[ data.wiki ].indexOf( data.id ) > -1;
	}
};

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

wpnot.reducer.notifications = function ( state, action ) {
	if ( state === undefined ) {
		return [];
	}

	switch ( action.type ) {
		case POPULATE_FROM_OBJECT:
			return action.data.list.map(
					wpnot.helper.sanitizeNotificationData
				);
		case MARK_READ:
			// TODO: This should work with async actions
			// to update the API

			return state.filter( function ( item ) {
				return !wpnot.helper.isNotificationInWikiId( item, action.wikiIds )
			} );
	}

	return state;
};

/* Action types */

/*!
 * @type POPULATE_FROM_OBJECT
 *
 * @param {Object} data An object defining the
 *  list of notifications as is represented from
 *  the MediaWiki API response.
 */


/*!
 * @type MARK_READ
 *
 * @param {string} wiki The wiki symbolic name
 *  the notification is associated with.
 * @param {string[]} ids List of ids to mark as
 *  read in this wiki
 */

wpnot.reducer.sources = function ( state, action ) {
	var newState;

	if ( state === undefined ) {
		return {};
	}

	switch ( action.type ) {
		case ADD_SOURCE:
			newState = Object.assign( {}, state );
			newState[ action.data.id ] = {
				id: action.data.id,
				name: action.data.name,
				url: action.data.url
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

wpnot.reducer.combinedReducer = Redux.combineReducers( {
	list: wpnot.reducer.notifications,
	sources: wpnot.reducer.sources,
	api: wpnot.reducer.api
} );
