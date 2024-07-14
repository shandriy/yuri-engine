var yuri = (function() {
  var yuri;
  yuri = {
    init: function(width, height, scale, backgroundColor) {
      yuri.props.width = width;
      yuri.props.height = height;
      var scaleStyle = true;
      if (scale === !!scale)
        scaleStyle = !scale;
      yuri.props.scaleStyle = scaleStyle;
      var html = document.getElementsByTagName("html")[0];
      html.style.width = "100%";
      html.style.height = "100%";
      html.style.margin = "0";
      html.style.padding = "0";
      document.body.innerHTML = "";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.backgroundColor = "#fff";
      if (backgroundColor)
        document.body.style.backgroundColor = backgroundColor;
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d", { alpha: false });
      yuri.props.canvas = canvas;
      yuri.props.context = context; 
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.style.position = "absolute";
      canvas.style.margin = "0";
      canvas.style.padding = "0";
      if (scaleStyle) {
        canvas.width = width;
        canvas.height = height;
      };
      var aspectRatio = width / height;
      function resize() {
        var outWidth, outHeight, top, left;
        if (innerWidth * height > innerHeight * width) {
          outWidth = innerHeight * aspectRatio;
          outHeight = innerHeight;
          left = (innerWidth - outWidth) / 2;
          top = 0;
        } else {
          outHeight = innerWidth / aspectRatio;
          outWidth = innerWidth;
          top = (innerHeight - outHeight) / 2;
          left = 0;
        };
        canvas.style.top = top + "px";
        canvas.style.left = left + "px";
        if (scaleStyle) {
          canvas.style.width = outWidth + "px";
          canvas.style.height = outHeight + "px";
        } else {
          canvas.width = Math.round(outWidth);
          canvas.height = Math.round(outHeight);
        };
      };
      resize();
      addEventListener("focus", resize);
      addEventListener("resize", resize);
      document.body.appendChild(canvas);
    },
    props: {
      width: 300,
      height: 150,
      scaleStyle: true,
      canvas: undefined,
      context: undefined
    },
    entities: [],
    Entity: function(imageData, shown) {
      if (imageData)
        this.spritesheet = imageData;
      if (shown === !!shown)
        this.shown = shown;
      this.index = yuri.entities.length;
      yuri.entities.push(this);
    }
  };
  yuri.Entity.prototype.x = 0;
  yuri.Entity.prototype.y = 0;
  yuri.Entity.prototype.z = 0;
  yuri.Entity.prototype.shown = true;
  yuri.Entity.prototype.spritesheet = new Image();
  yuri.Entity.prototype.destroy = function() {
    yuri.entities.splice(this.index, 1);
  };
  return yuri;
})();
addEventListener("DOMContentLoaded", function() {
  yuri.init(800, 600, false);
});