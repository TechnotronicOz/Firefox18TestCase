(function() {

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };

    // extend backbone's events to our vent variable
    var vent = _.extend({}, Backbone.Events);

    // template helper function
	App.template = function(id) {
		return _.template( $('#' + id).html() );
	};


	/*
	|----------------------------------------------
	|	Story Model
	|----------------------------------------------
	*/
    App.Models.Story = Backbone.Model.extend({
        defaults: {
            'id': null,
            'pillar': '',
            'reason': '',
            'storyShort': '',
            'storyLong': '',
            'imgWall': '',
            'imgSlide': '',
            'imgStory': '',
            'linkUrl': '',
            'blockSize': '',
            'blockEmpty': '',
            'blockColor': ''
        },
        urlRoot: 'data.json'
    });


	/* ----------------------------------------------
	|	Collection of Stories
	|---------------------------------------------- */
    App.Collections.Stories = Backbone.Collection.extend({
        model: App.Models.Story,
        url: 'data.json'
    });


	/* ----------------------------------------------
	|	General App View - Init Views by passing in
    |   the collections and append our wall to the page
	|---------------------------------------------- */
	App.Views.App = Backbone.View.extend({
		initialize: function() {
			var storyView = new App.Views.Story({ collection: App.stories });
			var allStories = new App.Views.Stories({ collection: App.stories }).render();
			$('.wall').append(allStories.el);
		}
	});


	/* ----------------------------------------------
	|	Single Story View
	|---------------------------------------------- */
    App.Views.Story = Backbone.View.extend({
		//tagName: 'li',
		template: App.template('story-template'),
		template_empty: App.template('story-template-empty'),
		template_transparent: App.template('story-template-transparent'),

		render: function() {
			if ( this.model.get('blockEmpty') === true ) {

				if ( this.model.get('blockColor') == 'transparent' ) {
					this.$el.html( this.template_transparent( this.model.toJSON() ) );
				} else {
					this.$el.html( this.template_empty( this.model.toJSON() ) );
				}

			} else {
				this.$el.html( this.template( this.model.toJSON() ) );
			}
			return this;
		}

	});


	/* ----------------------------------------------
	|	All Stories View
	|---------------------------------------------- */
	App.Views.Stories = Backbone.View.extend({
		//tagName: 'ul',

		render: function() {
			this.collection.each( this.addOne, this );
			return this;
		},

		addOne: function(story) {
			var storyView = new App.Views.Story({ model: story });
			this.$el.append(storyView.render().el);
		}
	});


	/*
	|----------------------------------------------
	|	Router
	|----------------------------------------------
	*/
    App.Router = Backbone.Router.extend({
        routes: {
			'': 'index'
		},

		index: function() {

		}
    });

})();

new App.Router();
Backbone.history.start();

App.stories = new App.Collections.Stories();
App.stories.fetch().then(function() {
	new App.Views.App({ collection: App.stories });
});