
var NotificationsWrapper = React.createClass( {
	setLoading: function ( isLoading ) {
		$( '#wrapper').toggleClass( 'loading', isLoading );
	},
	componentDidMount: function () {
		// this.loadLocalNotifsFromServer();
	},
	render: function() {
		if ( this.props.state.api.isFetching ) {
			this.setLoading( true );
			return null;
		}

		this.setLoading( false );
		if ( this.props.state.api.isError ) {
			return (
				<div className="wpnot-notificationsWrapper">
					<span className="wpnot-notificationsWrapper-errorMessage">
						An error has occurred while fetching notifications.
					</span>
				</div>
			);
		}

		if ( this.props.state.list.length > 0 ) {
			return (
				<div className="wpnot-notificationsWrapper">
					<span className="wpnot-notificationsWrapper-title">Unread notifications</span>
					<NotificationsList list={this.props.state.list} sources={this.props.state.sources} />
				</div>
			);
		} else {
			return (
				<div className="wpnot-notificationsWrapper">
					<span className="wpnot-notificationsWrapper-errorMessage">
						You have no unread notifications.
					</span>
				</div>
			);
		}
	}
} );

var MarkAsReadButton = React.createClass( {
	handleClick: function () {
		wpnot.store.dispatch( wpnot.action.markRead(
			this.props.wiki, this.props.id
		) );
	},
	render: function () {
		return (
			<div className="wpnot-notificationItem-markread" onClick={this.handleClick}>
				<span className="wpnot-notificationItem-markread-icon"></span>
			</div>
		);
	}
} );

var NotificationsList = React.createClass( {
	getInitialState: function () {
	    return {};
	},
	render: function() {
		var list = this.props.list.sort( function ( item1, item2 ) {
				// Reverse-sort notifications by date
				if ( item1.timestamp.unix > item2.timestamp.unix ) {
					return -1;
				} else if ( item1.timestamp.unix < item2.timestamp.unix ) {
					return 1;
				}
				return 0;
			} ),
			sources = this.props.sources,
			itemNodes = list.map( function( item ) {
				var key = item.wiki + '_' + item.id,
					headerHtml = { __html: item.text.header },
					bodyHtml = { __html: item.text.body },
					wikiName = item.wiki === 'wiki' ?
						CONFIG_WIKI_NAME :
						(
							sources[ item.wiki ] &&
							sources[ item.wiki ].name
						) ||
						item.wiki;

				return (
					<NotificationItem wiki={item.wiki} key={key}>
						<div className="wpnot-notificationItem-row">
							<div className="wpnot-notificationItem-wiki">
								<span className="wpnot-notificationItem-wiki-text">{wikiName}</span>
							</div>
							<ItemContent headerHtml={headerHtml} bodyHtml={bodyHtml} url={item.link.url}></ItemContent>
							<span className="wpnot-notificationItem-timestamp">{item.timestamp.human}</span>
							{/*<MarkAsReadButton wiki={item.wiki} id={item.id} />*/ null}
						</div>
					</NotificationItem>
				);
			} );
		return (
			<div className="wpnot-notificationsList">
				{itemNodes}
			</div>
		);
	}
} );

var ItemContent = React.createClass({
	handleClick: function () {
		if ( this.props.url ) {
			chrome.tabs.create( {url: this.props.url } );
		}
		return false;
	},
	render: function () {
		return (
			<div className="wpnot-notificationItem-content" onClick={this.handleClick}>
				<div className="wpnot-notificationItem-content-header" dangerouslySetInnerHTML={this.props.headerHtml}></div>
				{
					this.props.bodyHtml ?
					<div className="wpnot-notificationItem-content-body" dangerouslySetInnerHTML={this.props.bodyHtml}></div> :
					null
				}
			</div>
		);
	}
} );

var NotificationItem = React.createClass({
	render: function() {
		return (
			<div className="wpnot-notificationItem">
			{this.props.children}
			</div>
		);
	}
} );

wpnot.store = Redux.createStore(
	// Reducer
	wpnot.reducer.combinedReducer,
	// Initial state
	{},
	// Middleware
	Redux.applyMiddleware( ReduxThunk.default )
);

var render = function () {
		ReactDOM.render(
			<NotificationsWrapper state={wpnot.store.getState()} />,
			document.getElementById( 'wrapper' )
		);
	};

$( document ).ready( function () {
	render();
	wpnot.store.subscribe( render );

	// Get the notifications
	wpnot.store.dispatch(
		wpnot.action.fetchNotifications()
	);
} );
