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
