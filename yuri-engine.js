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
    Entity: function(name, shown, imageData, spriteWidth, spriteHeight) {
      this.name = name;
      if (shown === !!shown)
        this.shown = shown;
      if (imageData)
        this.spritesheet = imageData;
      if (spriteWidth)
        this.spriteWidth = spriteWidth;
      if (spriteHeight)
        this.spriteHeight = spriteHeight;
      this.index = yuri.entities.length;
      yuri.entities.push(this);
    },
    frame: function(run) {
      var animate = window.requestAnimationFrame || setTimeout;
      var now = window.performance ? performance.now ? function() {
        return performance.now();
      } : Date.now : Date.now;
      var previous = now(), current;
      function animated() {
        yuri.props.context.clearRect(0, 0, yuri.props.canvas.width, yuri.props.canvas.height);
        current = now();
        run(current - previous);
        previous = current;
        var len = yuri.entities.length;
        yuri.entities.sort(function(one, two) {
          return one.z - two.z;
        });
        for (var i = 0; i < len; i += 1) {
          var entity = yuri.entities[i];
          if (entity.shown) {
            if (typeof entity.spritesheet === "function") {
              entity.spritesheet();
            } else {
              if (entity.spriteWidth && entity.spriteHeight) {
                var horizontal = entity.spritesheet.width / entity.spriteWidth;
                var animationX = entity.animation % horizontal;
                var animationY = (entity.animation - animationX) / horizontal;
                if (yuri.props.scaleStyle)
                  yuri.props.context.drawImage(
                    entity.spritesheet, animationX * entity.spriteWidth, animationY * entity.spriteHeight, entity.spriteWidth, entity.spriteHeight,
                    entity.x - (entity.spriteWidth / 2), entity.y - (entity.spriteHeight / 2), entity.spriteWidth, entity.spriteHeight
                  );
                else {
                  var width = (entity.spriteWidth / yuri.props.width) * yuri.props.canvas.width;
                  var height = (entity.spriteHeight / yuri.props.height) * yuri.props.canvas.height;
                  yuri.props.context.drawImage(
                    entity.spritesheet, animationX * entity.spriteWidth, animationY * entity.spriteHeight, entity.spriteWidth, entity.spriteHeight,
                    entity.x - (entity.spriteWidth / 2), entity.y - (entity.spriteHeight / 2), width, height
                  );
                };
              } else {
                if (yuri.props.scaleStyle)
                  yuri.props.context.drawImage(entity.spritesheet, entity.x - (entity.spritesheet.width / 2), entity.y - (entity.spritesheet.height / 2));
                else {
                  var width = (entity.spritesheet.width / yuri.props.width) * yuri.props.canvas.width;
                  var height = (entity.spritesheet.height / yuri.props.height) * yuri.props.canvas.height;
                  yuri.props.context.drawImage(entity.spritesheet, entity.x - (width / 2), entity.y - (height / 2), width, height);
                };
              };
            };
          };
        };
        animate(animated);
      };
      animated();
    },
    getEntityByName: function(name) {
      var length = yuri.entities.length;
      for (var i = 0; i < length; i += 1)
        if (yuri.entities[i].name === name)
          return yuri.entities[i];
    },
    keyboard: {
      down: [],
      isDown: function(key) {
        return yuri.keyboard.down.indexOf(key) > -1;
      }
    }
  };
  yuri.Entity.prototype.x = 0;
  yuri.Entity.prototype.y = 0;
  yuri.Entity.prototype.z = 0;
  yuri.Entity.prototype.shown = true;
  yuri.Entity.prototype.spritesheet = new Image();
  yuri.Entity.prototype.spriteWidth = undefined;
  yuri.Entity.prototype.spriteHeight = undefined;
  yuri.Entity.prototype.animation = 0;
  yuri.Entity.prototype.destroy = function() {
    yuri.entities.splice(this.index, 1);
    var length = yuri.entities.length;
    for (var i = this.index; i < length; i += 1) {
      yuri.entities[i].index -= 1;
    };
  };
  function convertKey(keyboardEvent) {
    if (keyboardEvent.code)
      return keyboardEvent.code;
    var keyCode = keyboardEvent.keyCode;
    if (keyCode >= 65 && keyCode <= 90)
      return "Key" + ("ABCDEFGHIJKLMNOPQRSTUVWXYZ"[keyCode - 65]);
    if (keyCode >= 48 && keyCode <= 57)
      return keyCode - 48;
    if (keyCode >= 112 && keyCode <= 135)
      return "F" + (keyCode - 111);
    switch (keyCode) {
      case 8:
        return "Backspace";
      case 9:
        return "Tab";
      case 13:
        return "Enter";
      case 16:
        return "ShiftLeft";
      case 32:
        return "Space";
      case 37:
        return "ArrowLeft";
      case 38:
        return "ArrowUp";
      case 39:
        return "ArrowRight";
      case 40:
        return "ArrowDown";
      case 46:
        return "Delete";
    };
  };
  addEventListener("keydown", function(keyboardEvent) {
    var key = convertKey(keyboardEvent);
    if (yuri.keyboard.down.indexOf(key) === -1)
      yuri.keyboard.down.push(key);
  });
  addEventListener("keyup", function(keyboardEvent) {
    var key = convertKey(keyboardEvent);
    var index = yuri.keyboard.down.indexOf(key);
    if (index > -1)
      yuri.keyboard.down.splice(index, 1);
  });
  addEventListener("blur", function() {
    yuri.keyboard.down = [];
  });
  return yuri;
})();