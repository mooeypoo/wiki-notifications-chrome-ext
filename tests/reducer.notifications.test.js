QUnit.test( "Notifications reducer", function( assert ) {
	// Initial state
	assert.deepEqual(
		wpnot.reducer.notifications(),
		[],
		'Initial state'
	);

	// Populate
	assert.deepEqual(
		wpnot.reducer.notifications(
			[],
			wpnot.action.populateFromObject( mockAPIdata )
		),
		[
			{
				id: '568',
				wiki: 'wiki',
				timestamp: {
					unix: '1463000401',
					human: '11 May'
				},
				text: {
					header: "‪Moriel‬ left a message on <strong>your talk page</strong> in \"<strong>‪section RS1hFJb5jI‬</strong>\".",
					body: "this is the text RS1hFJb5jI",
				},
				link: {
					url: "http://dev.wiki.local.wmftest.net:8080/wiki/User_talk:Admin?markasread=568#section_RS1hFJb5jI",
					label: "View message"
				}
			},
			{
				id: '884',
				wiki: 'wiki',
				timestamp: {
					unix: '1466100557',
					human: 'Today'
				},
				text: {
					header: 'New topic created on <strong>‪Flow test talk:TestingStuff‬</strong>: <bdi>\"<strong>‪asdsad‬</strong>\"</bdi>.',
					body: 'fddfgdgf',
				},
				link: {
					url: 'http://dev.wiki.local.wmftest.net:8080/wiki/Topic:T5zxozlruiiokgw9?markasread=884',
					label: 'View topic'
				}
			},
		],
		'Notification data sanitation'
	);

	// Mark as read
	assert.deepEqual(
		wpnot.reducer.notifications(
			// Initial state
			[
				{
					id: '568',
					wiki: 'wiki',
					timestamp: {
						unix: '1463000401',
						human: '11 May'
					},
					text: {
						header: "‪Moriel‬ left a message on <strong>your talk page</strong> in \"<strong>‪section RS1hFJb5jI‬</strong>\".",
						body: "this is the text RS1hFJb5jI",
					},
					link: {
						url: "http://dev.wiki.local.wmftest.net:8080/wiki/User_talk:Admin?markasread=568#section_RS1hFJb5jI",
						label: "View message"
					}
				},
				{
					id: '884',
					wiki: 'wiki',
					timestamp: {
						unix: '1466100557',
						human: 'Today'
					},
					text: {
						header: 'New topic created on <strong>‪Flow test talk:TestingStuff‬</strong>: <bdi>\"<strong>‪asdsad‬</strong>\"</bdi>.',
						body: 'fddfgdgf',
					},
					link: {
						url: 'http://dev.wiki.local.wmftest.net:8080/wiki/Topic:T5zxozlruiiokgw9?markasread=884',
						label: 'View topic'
					}
				}
			],
			// Action
			wpnot.action.markReadInModel( 'wiki', '884' )
		),
		[
			{
				id: '568',
				wiki: 'wiki',
				timestamp: {
					unix: '1463000401',
					human: '11 May'
				},
				text: {
					header: "‪Moriel‬ left a message on <strong>your talk page</strong> in \"<strong>‪section RS1hFJb5jI‬</strong>\".",
					body: "this is the text RS1hFJb5jI",
				},
				link: {
					url: "http://dev.wiki.local.wmftest.net:8080/wiki/User_talk:Admin?markasread=568#section_RS1hFJb5jI",
					label: "View message"
				}
			}
		],
		'Mark notification as read'
	);

	assert.deepEqual(
		wpnot.reducer.notifications(
			// Initial state
			[
				{
					id: '568',
					wiki: 'wiki',
					timestamp: {
						unix: '1463000401',
						human: '11 May'
					},
					text: {
						header: "‪Moriel‬ left a message on <strong>your talk page</strong> in \"<strong>‪section RS1hFJb5jI‬</strong>\".",
						body: "this is the text RS1hFJb5jI",
					},
					link: {
						url: "http://dev.wiki.local.wmftest.net:8080/wiki/User_talk:Admin?markasread=568#section_RS1hFJb5jI",
						label: "View message"
					}
				},
				{
					id: '222',
					wiki: 'wiki',
					timestamp: {
						unix: '1466100557',
						human: 'Today'
					},
					text: {
						header: "‪Moriel‬ left a message on <strong>your talk page</strong> in \"<strong>‪section RS1hFJb5jI‬</strong>\".",
						body: "this is the text RS1hFJb5jI",
					},
					link: {
						url: "http://dev.wiki.local.wmftest.net:8080/wiki/User_talk:Admin?markasread=568#section_RS1hFJb5jI",
						label: "View message"
					}
				},
				{
					id: '884',
					wiki: 'wiki',
					timestamp: {
						unix: '1466100557',
						human: 'Today'
					},
					text: {
						header: 'New topic created on <strong>‪Flow test talk:TestingStuff‬</strong>: <bdi>\"<strong>‪asdsad‬</strong>\"</bdi>.',
						body: 'fddfgdgf',
					},
					link: {
						url: 'http://dev.wiki.local.wmftest.net:8080/wiki/Topic:T5zxozlruiiokgw9?markasread=884',
						label: 'View topic'
					}
				}
			],
			// Action
			wpnot.action.markReadInModel( 'wiki', [ '884', '222' ] )
		),
		[
			{
				id: '568',
				wiki: 'wiki',
				timestamp: {
					unix: '1463000401',
					human: '11 May'
				},
				text: {
					header: "‪Moriel‬ left a message on <strong>your talk page</strong> in \"<strong>‪section RS1hFJb5jI‬</strong>\".",
					body: "this is the text RS1hFJb5jI",
				},
				link: {
					url: "http://dev.wiki.local.wmftest.net:8080/wiki/User_talk:Admin?markasread=568#section_RS1hFJb5jI",
					label: "View message"
				}
			}
		],
		'Mark multiple notifications as read'
	);
} );

var mockAPIdata = [
	{
		wiki: "wiki",
		id: "568",
		type: "edit-user-talk",
		category: "edit-user-talk",
		timestamp: {
			utcunix: "1463000401",
			unix: "1463000401",
			utcmw: "20160511210001",
			mw: "20160511140001",
			date: "11 May"
		},
		title: {
			full: "User talk:Admin",
			namespace: "User_talk",
			'namespace-key': 3,
			text: "Admin"
		},
		agent: {
			id: 8,
			name: "Moriel"
		},
		revid: 571,
		read: "20160614224419",
		targetpages: [],
		'*': {
			header: "‪Moriel‬ left a message on <strong>your talk page</strong> in \"<strong>‪section RS1hFJb5jI‬</strong>\".",
			compactHeader: "‪Moriel‬ left a message on <strong>your talk page</strong> in \"<strong>‪section RS1hFJb5jI‬</strong>\".",
			body: "this is the text RS1hFJb5jI",
			icon: "edit-user-talk",
			links: {
				primary: {
					url: "http://dev.wiki.local.wmftest.net:8080/wiki/User_talk:Admin?markasread=568#section_RS1hFJb5jI",
					label: "View message"
				},
				secondary: [
					{
						url: "http://dev.wiki.local.wmftest.net:8080/wiki/User:Moriel",
						label: "‪Moriel‬",
						tooltip: "",
						description: "",
						icon: "userAvatar",
						prioritized: ""
					},
					{
						url: "http://dev.wiki.local.wmftest.net:8080/w/index.php?title=User_talk:Admin&oldid=prev&diff=571",
						label: "View changes",
						description: "",
						icon: "changes",
						prioritized: ""
					}
				]
			},
			iconUrl: "/w/extensions/Echo/modules/icons/edit-user-talk.svg"
		}
	},
	{
		wiki: "wiki",
		id: "884",
		type: "flow-new-topic",
		category: "flow-discussion",
		timestamp: {
			utcunix: "1466100557",
			unix: "1466100557",
			utcmw: "20160616180917",
			mw: "20160616110917",
			date: "Today"
		},
		title: {
			full: "Flow test talk:TestingStuff",
			namespace: "Flow_test_talk",
			'namespace-key': 191,
			text: "TestingStuff"
		},
		agent: {
			id: 8,
			name: "Moriel"
		},
		read: "20160616192848",
		targetpages: [],
		'*': {
			header: "New topic created on <strong>‪Flow test talk:TestingStuff‬</strong>: <bdi>\"<strong>‪asdsad‬</strong>\"</bdi>.",
			compactHeader: "\"<strong>‪asdsad‬</strong>\"",
			body: "fddfgdgf",
			icon: "flow-new-topic",
			links: {
				primary: {
					url: "http://dev.wiki.local.wmftest.net:8080/wiki/Topic:T5zxozlruiiokgw9?markasread=884",
					label: "View topic"
				},
				secondary: [
					{
						url: "http://dev.wiki.local.wmftest.net:8080/wiki/User:Moriel",
						label: "‪Moriel‬",
						tooltip: "",
						description: "",
						icon: "userAvatar",
						prioritized: ""
					},
					{
						url: "http://dev.wiki.local.wmftest.net:8080/w/index.php?title=Flow_test_talk:TestingStuff&topiclist_sortby=newest",
						label: "‪TestingStuff‬",
						tooltip: "Flow test talk:TestingStuff",
						description: "",
						icon: "speechBubbles",
						prioritized: ""
					}
				]
			},
			iconUrl: "/w/extensions/Flow/modules/notification/icon/flow-new-topic.svg"
		}
	}
];
