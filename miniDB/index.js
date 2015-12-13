var $pLog  = $('#pLog');
var $cmd   = $('#cmd');
var $dbOut = $('#dbOut');
var $rmLog = $('#rmLog');

function clearLog()   { $pLog.html(""); }
function mylogNoBr(v) { $pLog.html($pLog.html() + v);          }
function mylog(v)     { $pLog.html($pLog.html() + v + "<br>"); }

//$(function() {
  // Init nonDB stuff.
  clearLog();
  var articles = [];
  articlesURL = 'articles.json';

  // Init SQL database. Wipe it clean since this is a demo and not Lab #8
  webDB.init();
  runSQLcmd('DROP TABLE articles');
  webDB.setupTables();

  // Get external data. For this demo, this code acts as a cache miss handler
  $.getJSON(articlesURL, processJSON);

  function processJSON(data) {
    webDB.insertAllRecords(data);
    console.log("Async: Just after insertAllRecords() call.");
    // getAllArticles() is sequential and accepts a callback, so we can do this:
    webDB.getAllArticles(showArticles);

    // If getAllArticles() didn't take a callback (if it were like
    // insertAllArticles()), or if we didn't supply a callback to
    // getAllArticles(), then we'd use
    //   webDB.getAllArticles();
    // followed by
    //   webDB.defer(showArticles);
    // to avoid a race condition.
  }

  // Render. Data must exist at this point!
  function showArticles(A) {
    articles = A;
    console.log("Async: Near top of showArticles(): articles="+articles);
    $.each(articles, function(i, a) {
console.log('  a=' + a);
      $row = $('<tr>');
      $cell0 = $('<td>').text(a.author);   $row.append($cell0);
      $cell1 = $('<td>').text(a['title']); $row.append($cell1);
      $cell2 = $('<td>').text(a['body']);  $row.append($cell2);
      $dbOut.append($row);
    });
  }

  function runSQLcmd(cmd) {
    webDB.execute(cmd,
                  function(r) { mylog('<hr>'+cmd+"<br>"+JSON.stringify(r)); }
                 );
  }
  // articles = [
  //   { title: 'Ender\'s Game',
  //     author: 'Orson Scott Card',
  //     body:   'Enter was a young boy, but not from that song by John Cougar Melloncamp. Ender is a morphed version of \'Andrew\'. Ender saves the world.'},
  //   { title: 'The Left Hand of Darkness',
  //     author: 'Ursula K. Le Guin',
  //     body:   'This novel won both Hugo and Nebula awards in the same year.'}
  // ];

  function checksemi(ev) {
    var cv = $cmd.val();
    if (cv.match(/.+;/)) {
//    mylog('SQL command: "'+cv+'"');
      runSQLcmd(cv);
    }
  }

  $cmd.on('input', checksemi);
  $rmLog.on('click', clearLog);
//});
