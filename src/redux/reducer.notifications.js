wpnot.reducer.notifications = function ( state, action ) {
	var list;
	if ( state === undefined ) {
		return [];
	}

	switch ( action.type ) {
		case POPULATE_FROM_OBJECT:
			list = action.list.filter( function ( item ) {
				// Remove xwiki notifications
				return item.id >= 0;
			} );
			return list.map(
				wpnot.helper.sanitizeNotificationData
			);
		case MARK_READ:

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
