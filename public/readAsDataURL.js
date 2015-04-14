onmessage = function (msg){
  var file = msg.data[0],
      reader = new FileReader();

  reader.onloadend = function (){
    postMessage([
      {
        title: file.name,
        data: this.result
      }
    ]);
  };

  reader.readAsDataURL(file);
};