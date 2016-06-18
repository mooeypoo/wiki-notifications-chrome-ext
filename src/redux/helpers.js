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
