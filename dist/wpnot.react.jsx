
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
					<NotificationsList list={this.props.state.list} />
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

var GoButton = React.createClass( {
	handleClick: function () {
		chrome.tabs.create( {url: this.props.itemUrl } );
	},
	render: function () {
		if ( !this.props.itemUrl ) {
			return <span></span>
		}
		return (
			<span className="wpnot-notificationItem-gobutton" onClick={this.handleClick}>Visit</span>
		);
	}
} );

var NotificationsList = React.createClass( {
	render: function() {
		console.log( 'NotificationsList list', this.props.list );
		var itemNodes = this.props.list.map( function( item ) {
			var key = item.wiki + '_' + item.id,
				headerHtml = { __html: item.header },
				bodyHtml = { __html: item.body },
				wikiName = item.wikiName || item.wiki;

			return (
				<NotificationItem wiki={item.wikiName} key={key}>
					<GoButton itemUrl={item.link} />
					<span className="notificationItem-wiki">{wikiName}</span>
					<div className="notificationItem-content-header" dangerouslySetInnerHTML={headerHtml}></div>
					<div className="notificationItem-content-body" dangerouslySetInnerHTML={bodyHtml}></div>
				</NotificationItem>
			);
		} )
		return (
			<div className="notificationsList">
				{itemNodes}
			</div>
		);
	}
} );

var NotificationItem = React.createClass({
  render: function() {
    return (
      <div className="notificationItem">
        {this.props.children}
      </div>
    );
  }
});

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

render();

wpnot.store.subscribe( render );
