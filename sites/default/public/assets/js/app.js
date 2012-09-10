(function() {

	$(document).ready(function() {

		// -> Application UI Helpers
		var ApplicationUI = Backbone.Model.extend({
			initialize: function() {
				this.dom = {
					nav: $('#navbar')
				}
				this.bindNav() ;
				this.bindHashClick() ;
				this.bindPostClick() ;
				//this.liveReload() ;
				this.initSocketIO() ;
				this.initWidgets() ;

				//this.headerAnime() ;

				//this.info('success', 'Welcome to '+this.dom.nav.find('a.brand').text()+' !') ;
				return this; 
			},

			//============================================================= HELPERS
			parse_url: function(url) {
			    var a = document.createElement('a');
			    a.href = url;
			    return a;
			},
			info: function(type, message, manualClose) {
			    $("#alert-area").append($("<div class='alert alert-" + type + " fade in' data-alert><button type='button' class='close' data-dismiss='alert'>×</button><p> " + message + " </p></div>"));
			    if ( ! manualClose ) $(".alert").delay(4000).fadeOut("slow", function () { $(this).remove(); });
			},
			getCurrentTab: function() {
				self.currentTab = $.trim(this.dom.nav.find('ul.nav li.active').text()).toLowerCase() ;
				return self.currentTab;
			},

			//============================================================= BINDINGS
			bindNav: function() {
				var self = this, navLinks ;
				navLinks = this.dom.nav.find('ul.nav li'); 

				// -> Bind clicks
				navLinks.live('click', function(e) {
					$(this).addClass('active').siblings().removeClass('active')
					self.getCurrentTab() ;
				}) ;

				// -> If no active tab at page loading
				if ( ! navLinks.filter('.active').length ) {
					var path = (self.parse_url(window.location.href).pathname).match(/^\/([a-zA-Z0-9.\-]+)\//) ;
					var activeEl = navLinks.first() ;
					if ( path ) {
						var searchEl = navLinks.filter('.menu-'+path[1]); 
						if ( searchEl.length ) activeEl = searchEl ;
					}
					activeEl.addClass('active')
				}
			},
			bindHashClick: function() {
				$('a').live('click', function(e) {

					var link = this.getAttribute('href'), match ;
					if ( /\#/.test(link) ) {
						console.log('Hash Tag Click !!')

						// -> If link is login provider choice
						if ( match = (link.split('#')[1]).match(/\/auth\/(.*)/) ) {
							var el = $(this).parent() ;
							var sliderIndex = el.index() ;
							var sliderContainer = $('#login_panel') ;
							var sliderHeight = sliderContainer.height() ;

							sliderContainer.css({
								transform: 'translate3d(0, '+(-sliderIndex*sliderHeight)+'px, 0)',
								transition: 'all 400ms ease-in-out'
							})

							el.addClass('active').siblings().removeClass('active');

							e.stopPropagation(); 
							e.preventDefault() ;
						}
					}

				}) ;
			},
			bindPostClick: function() {
				$('.post.list .content').live('click', function(e) {
					var permalink = $(this).find('a.permalink').attr('href') ;
					if ( permalink ) window.top.location.href = permalink; 
					return false;
				}) ;
				$('.post.list .content').each(function() {
					var el = $(this) ;
					var permalink = el.find('a.permalink') ;
					if ( permalink ) {
						el.attr('title', permalink.attr('title'))
					}
				})
			},
			liveReload: function() {
				setTimeout(function() {
					$('<script src="https://github.com/livereload/livereload-js/raw/master/dist/livereload.js?host=localhost"></script>').appendTo('body')
				}, 1000)
			},
			initSocketIO: function() {
				require(["/socket.io/socket.io.js"], function() {
					var socket = io.connect();
					socket.on('news', function (data) {
						console.log('[>] Socket.io message : '+JSON.stringify(data));
					});					
				})
			},

			//============================================================= INIT WIDGETS
			initWidgets: function() {
				//if ( $('#widget-sidebar').length == 0 ) return false;
				_.each(widgets, function(widget, widgetId) {
					widgets[widgetId] = widget = new widget() ;
					if ( $('#widget-sidebar').length == 0 && ! widget.daemon ) return true;
					if (  _.isFunction(widget.onClientRender) ) {
						widget.onClientRender() ;
					}
				})
			},

			//============================================================= HEADER ANIMATION
			/*
			headerAnime: function() {
				var inner = $('header .inner'), pos, seq = [[50, 40], [50, 50], [50, 60],[60, 30],[60, 40], [60, 50], [60, 60],[50, 30]] ;
				self.headerAnimeLoop = setInterval(function() {
					seq.push(pos=seq.shift()) ;
					inner.css({
						backgroundPosition: pos[0]+'px '+pos[1]+'px'
					})
				}, 1000) ;
			}
			*/
		})


		// -> Init application UI
		console.log('[>] Document is ready !')
		var app = new ApplicationUI() ;

	}); 

}).apply(this) ;