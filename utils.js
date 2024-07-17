var utils = (function() {
  var utils;
  utils = {
    load: {
      image: function(path, onload) {
        var image = new Image();
        if (onload) image.addEventListener("load", function() {
          onload(image, path);
        });
        image.src = path;
        return image;
      },
      images: function(pathArray, prefix, postfix, onload) {
        var imageArray = [];
        var length = pathArray.length;
        var prepend = prefix ? prefix : "";
        var append = postfix ? postfix : "";
        for (var i = 0; i < length; i += 1) {
          var image = new Image();
          var path = prepend + pathArray[i] + append;
          if (onload) image.addEventListener("load", function() {
            onload(image, path);
          });
          image.src = path;
          imageArray.push(image);
        };
        return imageArray;
      },
      script: function(path, onload) {
        var script = document.createElement("script");
        if (onload) script.addEventListener("load", function() {
          onload(path);
        });
        script.setAttribute("src", path);
        document.body.appendChild(script);
      },
      scripts: function(pathArray, prefix, postfix, onload) {
        var length = pathArray.length;
        var prepend = prefix ? prefix : "";
        var append = postfix ? postfix : "";
        for (var i = 0; i < length; i += 1) {
          var script = document.createElement("script");
          var path = prepend + pathArray[i] + append;
          if (onload) script.addEventListener("load", function() {
            onload(path);
          });
          script.setAttribute("src", path);
          document.body.appendChild(script);
        };
      }
    }
  };
  return utils;
})();