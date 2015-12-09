$(function() {

var blog = {};
blog.articles = [];

blog.loadArticles = function() {
  $.get('article.handlebars', function(data, message, xhr) {
    Article.prototype.template = Handlebars.compile(data);
    $.ajax({
      type: 'HEAD',
      url: 'blogArticles.json',
      success: blog.fetchArticles
    });
  });
};

blog.fetchArticles = function(data, message, xhr) {
  var eTag = xhr.getResponseHeader('eTag');
  console.log("Server eTag="+ eTag);
  if (typeof localStorage.articlesEtag == 'undefined' || localStorage.articlesEtag != eTag) {
    console.log('cache miss!');
    localStorage.articlesEtag = eTag;
    $.getJSON('blogArticles.json', blog.initArticles);
  } else {
    console.log('cache hit!');
    blog.rawData = JSON.parse(localStorage.blogData);
  }
};

blog.initArticles = function(data, msg, xhr) {
  blog.rawData = data;
  localStorage.blogData = JSON.stringify(data);
};

blog.loadArticles();

});