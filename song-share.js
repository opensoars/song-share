/**
 * Globals
 */
var HTTP_PORT = 3333;

/**
 * Mongo collections
 */
var Songs = new Mongo.Collection('songs');


if(Meteor.isClient){
  Meteor.subscribe('songs');

  Template.upload.events({
    'change input': function (evt){
      var file = evt.target.files[0],
          reader = new FileReader();

      reader.onloadend = function (){
        var self = this;

        Meteor.call('addSong', {
          title: file.name,
          data: self.result
        });
      };

      //reader.readAsDataURL(file);

      var worker = new Worker('');

    }
  });


  /**
   * Accounts config
   */
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

/**
 * Meteor methods
 */
Meteor.methods({
  addSong: function (song){
    HTTP.call('POST', 'http://127.0.0.1:' + HTTP_PORT, { data: song, },
      function (err, res){
        if(err) return console.log(err);
        console.log('http callback');
        console.log(res);
      }
    );
  }
});

if(Meteor.isServer){

  Meteor.startup(function (){

    /**
     * Server npm requirements
     */
    var http = Npm.require('http'),
        fs = Npm.require('fs');


    /**
     * HTTP server used for storing base64 songs
     */
    http.createServer(function (req, res){
      var b = ''; req.on('data', function (c){ b += c; });

      req.on('end', function (){
        console.log(b.length);
      });

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
            'Origin, X-Requested-With, Content-Type, Accept'
      });
      res.end('ok');

    }).listen(HTTP_PORT);

  });
}
