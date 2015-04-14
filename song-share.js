var HTTP_PORT = 3333;

var Songs = new Mongo.Collection('songs');



if(Meteor.isClient){
  Meteor.subscribe('songs');

  Template.upload.events({
    'change input': function (evt){
      var file = evt.target.files[0],
          reader = new FileReader();

      reader.onload = function (){
        var self = this;

        Meteor.call('addSong', {
          title: file.name,
          data: self.result
        });
      };

      reader.readAsDataURL(file);
    }
  });


  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addSong: function (song){
    console.log(song);
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
    var http = Npm.require('http'),
        fs = Npm.require('fs');

    http.createServer(function (req, res){
      var b = ''; req.on('data', function (c){ b += c; });

      req.on('end', function (){
        console.log(b.length);
      });

      res.end('');
    }).listen(HTTP_PORT);
  });
}
