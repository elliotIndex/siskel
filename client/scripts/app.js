var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    this.set('like', !this.get('like'));
    this.collection.sortByField(this.collection.comparator);
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function(movieList) {
    this.movieList = _.map(movieList, function(item){
      return new Movie(item);
    });
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    this.sort(this.comparator);
  }

});

var AppView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('change', this.collection.sortByField(this.collection.comparator), this.collection);
  },

  events: {
    'click form input': 'handleClick',
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.model.on('change', this.render, this);  
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function(e) {
    this.model.toggleLike();
  },

  handleLike: function(e) {
    //this.collection.sortByField(collection.comparator);
  },


  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // your code here
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
