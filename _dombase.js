/*
DOM[Digital Organic Matter] Copyright [2022] [@jntk.net]

Licensed under the Apache License, Version 2.0 (the “License”);
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an “AS IS” BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var domBase = function (num, tile,stage) {
    //num: Number of appearance
    //tile.color: Tile's color
    //tile.size: Tile's size
    //tile.gap: gap size between tile
    //stage.width
    //stage.hegiht
  
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    this.canvas = canvas;

    var stage_width = stage&&stage.width?stage.width:window.innerWidth;
    var stage_height = stage&&stage.height?stage.height:window.innerHeight;
    canvas.setAttribute("width", stage_width);
    canvas.setAttribute("height", stage_height);
    this.stage_width = stage_width;
    this.stage_height = stage_height;
    this.base_color = tile&&tile.color?tile.color:"#ddd";

    this.esa_ar = [];
    
    //size of tiles
    var width_size = tile&&tile.size?tile.size:10;
    var height_size = tile&&tile.size?tile.size:10;
    var gap_size = tile&&tile.gap?tile.gap:4;
    var object_number =Math.ceil(stage_width / (width_size)) * Math.ceil(stage_height / (height_size + gap_size));

    this.element_ar = [];
    this.aar = [];
    
    //Number of appearance
    var obj_number = num ? num : Math.floor(9 * Math.random()) + 1;
    if (obj_number > 50) { obj_number = 50 };
  
  this.moveObjectAr = [];
  for (let mo_i = 1; mo_i <= obj_number; mo_i++) {
    var mo1 = {
      x: stage_width * Math.random(),
      y: stage_height * Math.random(),
      width: 10,
      height: 10,
      color: "#ff0000",
      txt: "abc",
      step: 0,
      step_limit: 0,
      move_x: 0,
      move_y: 0,
      anim_color:
        "rgb(" +
        Math.floor(255 * Math.random()) +
        "," +
        Math.floor(255 * Math.random()) +
        "," +
        Math.floor(255 * Math.random()) +
        ")",
    };
    this.moveObjectAr.push(mo1);
  }
  
  this.init = init;
  function init(colorful) {
    if (this.canvas.getContext) {
      var context = this.canvas.getContext("2d");
      this.makePanels(context);
      var _ = this;
      setInterval(function () {
        _.drawPanels(context);
        _.animeAr(_.aar);

        for (let index2 = 0; index2 < _.aar.length; index2++) {
          var car = _.conflictObjectAr(_.aar[index2], _.element_ar);
          for (let index3 = 0; index3 < car.length; index3++) {
            var target_anim = car[index3];

            //Food
            var esa_aten = _.esa_ar.indexOf(target_anim);
            if (esa_aten >= 0) {
              _.esa_ar[esa_aten].color = _.base_color;
              _.esa_ar.splice(esa_aten, 1);
            }

            if (!target_anim.noaffect) {
              target_anim.noaffect = true;
              target_anim.noaffect_check = setTimeout(
                _.noaffect_func,
                3000,
                target_anim,
                target_anim.color
              );
              if (colorful) {
                target_anim.color =
                  "rgb(" +
                  Math.floor(255 * Math.random()) +
                  "," +
                  Math.floor(255 * Math.random()) +
                  "," +
                  Math.floor(255 * Math.random()) +
                  ")";
              } else {
                target_anim.color = target_anim.anim_color;
              }
            }
          }
        }

        for (let index4 = 0; index4 < _.moveObjectAr.length; index4++) {
          var obj1 = _.moveObjectAr[index4];
          _.move(obj1);
          obj1 = _.move_pattern_check(obj1);
        }
      }, 100);
    }

    _.canvas.addEventListener("click", function (e) {
      if (_.esa_ar.length < 1) {
        var position_ = _.conflictObjectAr(
          {
            x: e.clientX,
            y: e.clientY,
            anim_color: "#ff0000",
            width: 50,
            height: 50,
          },
          _.element_ar
        );
        for (let pi = 0; pi < position_.length; pi++) {
          _.esa_ar.push(position_[pi]);
          position_[pi].color = "#ff0000";
        }
      }
    });
  }


  this.makePanels = makePanels;
  function makePanels(context) {
    this.element_ar = [];
    context.clearRect(0, 0, stage_width, stage_height);
    var _x = 0;
    var _y = 0;
    for (let index = 0; index < object_number; index++) {
      //context.fillStyle = "rgb(" + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + ")";
      context.fillStyle = this.base_color;
      context.fillRect(_x, _y, width_size, height_size);
      var _text_pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var _text = _text_pool[Math.floor(_text_pool.length * Math.random())];
      //context.fillText(_text, _x, _y);
      this.element_ar.push({
        x: _x,
        y: _y,
        width: width_size,
        height: height_size,
        hit: false,
        x_o: _x,
        y_o: _y,
        width_o: width_size,
        height_o: height_size,
        color: context.fillStyle,
        txt: _text,
      });
      _x += gap_size + width_size;
      if (_x > stage_width) {
        _y += height_size + gap_size;
        _x = 0;
      }
    }
    context.fill();
  }

  this.drawPanels = drawPanels;
  function drawPanels(context) {
    context.clearRect(0, 0, stage_width, stage_height);
    var _x = gap_size;
    var _y = gap_size;
    for (let index = 0; index < this.element_ar.length; index++) {
      //context.fillStyle = 'rgb(' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ')';
      context.fillStyle = this.element_ar[index].color;
      context.fillRect(
        this.element_ar[index].x,
        this.element_ar[index].y,
        this.element_ar[index].width,
        this.element_ar[index].height
      );
      //Character of journey
      //context.fillStyle = "#fff";
      //context.font = this.element_ar[index].width+"px Arial";
      //context.fillText(this.element_ar[index].txt, this.element_ar[index].x, this.element_ar[index].y + this.element_ar[index].height);
    }
    context.fill();
    //context.fillstyle = "#ff0000";
    for (let eye_i = 0; eye_i < this.moveObjectAr.length; eye_i++) {
      var eye2_x = 8 * Math.cos(this.moveObjectAr[eye_i].angle + (90*(Math.PI/180)));
      var eye2_y = 8 * Math.sin(this.moveObjectAr[eye_i].angle + (90*(Math.PI/180)));

      context.beginPath();
      context.arc(
        this.moveObjectAr[eye_i].x - eye2_x,
        this.moveObjectAr[eye_i].y - eye2_y,
        10,
        (0 * Math.PI) / 180,
        (360 * Math.PI) / 180,
        false
      );
      context.fillStyle = "#fff";
      context.fill();
      context.beginPath();
      context.arc(
        this.moveObjectAr[eye_i].x + eye2_x,
        this.moveObjectAr[eye_i].y + eye2_y,
        10,
        (0 * Math.PI) / 180,
        (360 * Math.PI) / 180,
        false
      );
      context.fillStyle = "#fff";
      context.fill();

      context.beginPath();

      context.arc(
        this.moveObjectAr[eye_i].x - eye2_x,
        this.moveObjectAr[eye_i].y - eye2_y,
        5,
        (0 * Math.PI) / 180,
        (360 * Math.PI) / 180,
        false
      );
      context.fillStyle = "#000";
      context.fill(); 
      context.beginPath();
      context.arc(
        this.moveObjectAr[eye_i].x + eye2_x,
        this.moveObjectAr[eye_i].y + eye2_y,
        5,
        (0 * Math.PI) / 180,
        (360 * Math.PI) / 180,
        false
      );
      context.fillStyle = "#000";
      context.fill();
    }
  }

  this.animeAr = animeAr;
    function animeAr(aar) {
        for (let index = 0; index < aar.length; index++) {
      if (!aar[index].time) {
        aar[index].time = 1;
        aar[index].vec = 1;
        aar[index].destination = 5;
        aar[index].duration = 10;
      }
      aar[index].time += aar[index].vec;
      var times = Math.easeOutCubic(aar[index].time, 1, aar[index].destination, aar[index].duration);
      aar[index].width = times * aar[index].width_o;
      aar[index].height = times * aar[index].height_o;
      aar[index].x =
        aar[index].x_o - aar[index].width / 2 + aar[index].width_o / 2;
      aar[index].y =
        aar[index].y_o - aar[index].height / 2 + aar[index].height_o / 2;
      if (aar[index].time == 10) {
        aar[index].vec = -1;
      } else if (aar[index].time == 0) {
        aar[index].width = aar[index].width_o;
        aar[index].height = aar[index].height_o;
        aar[index].x = aar[index].x_o;
        aar[index].y = aar[index].y_o;
        aar.splice(index, 1);
      }
    }
  }

  this.conflicPosition = conflicPosition;
  function conflicPosition(position, ar) {
    var target_x = position.x;
    var target_y = position.y;
    for (let index = 0; index < ar.length; index++) {
      if (
        target_x >= ar[index].x &&
        target_x <= ar[index].x + ar[index].width &&
        target_y >= ar[index].y &&
        target_y <= ar[index].y + ar[index].height
      ) {
        return [index];
      }
    }
    return [];
  }

  this.conflictObjectAr = conflictObjectAr;
  function conflictObjectAr(position, ar) {
    var conflict_ar = [];
    for (let index = 0; index < ar.length; index++) {
      if (conflictObject(position, ar[index])) {
        ar[index].anim_color = position.anim_color;
        conflict_ar.push(ar[index]);
      }
    }
    return conflict_ar;
  }

  this.conflictObject = conflictObject;
  function conflictObject(target1, target2) {
    var target_x = target1.x;
    var target_y = target1.y;
    var target_width = target1.width != null ? target1.width : 0;
    var target_height = target1.height != null ? target1.height : 0;
    var target2_x = target2.x;
    var target2_y = target2.y;
    var target2_width = target2.width != null ? target2.width : 0;
    var target2_height = target2.height != null ? target2.height : 0;
    if (
      target_x <= target2_x &&
      target_x + target_width >= target2_x &&
      target_y <= target2_y &&
      target_y + target_height >= target2_y
    ) {
      return true;
    } else if (
      target_x <= target2_x + target2_width &&
      target_x + target_width >= target2_x + target2_width &&
      target_y <= target2_y &&
      target_y + target_height >= target2_y
    ) {
      return true;
    } else if (
      target_x <= target2_x &&
      target_x + target_width >= target2_x &&
      target_y <= target2_y + target2_height &&
      target_y + target_height >= target2_y + target2_height
    ) {
      return true;
    } else if (
      target_x <= target2_x + target2_width &&
      target_x + target_width >= target2_x + target2_width &&
      target_y <= target2_y + target2_height &&
      target_y + target_height >= target2_y + target2_height
    ) {
      return true;
    }
    return false;
  }

  this.noaffect_func = noaffect_func;
  function noaffect_func(_, color) {
    _.color = color;
    _.noaffect = false;
  }

  this.move = move;
  function move(obj) {
    var hit = this.conflictObjectAr(
      {
        x: obj.x - obj.width / 2,
        y: obj.y - obj.height / 2,
        width: obj.width,
        height: obj.height,
        anim_color: obj.anim_color,
      },
      this.element_ar
    );
    if (this.canvas.getContext && hit.length > 0) {
      for (let index = 0; index < hit.length; index++) {
        var target_anim = hit[index];
        if (target_anim && this.aar.indexOf(target_anim) === -1) {
          this.aar.push(target_anim);
          var e = this.element_ar.splice(
            this.element_ar.indexOf(target_anim),
            1
          );
          this.element_ar.push(e[0]);
        }
      }
    }
  }

  this.move_pattern = move_pattern;
  function move_pattern(obj, purpose) {
    var speed = 10;
    var step_limit = 100;
    obj.step = 0;
    obj.step_limit = Math.floor(step_limit * Math.random());
    var mvx = Math.floor(speed * Math.random());
    var mvy = Math.floor(speed * Math.random());

    if (purpose) {
      if (purpose.x - obj.x > 0) {
        obj.move_x = mvx;
      } else {
        obj.move_x = -mvx;
      }
    } else if (obj.x >= 0 && obj.x <= this.stage_width) {
      if (Math.random() < 0.5) {
        obj.move_x = mvx;
      } else {
        obj.move_x = -mvx;
      }
    } else if (obj.x <= 0) {
      obj.move_x = mvx;
    } else if (obj.x >= this.stage_width) {
      obj.move_x = -mvx;
    }
    if (purpose) {
      if (purpose.y - obj.y > 0) {
        obj.move_y = mvy;
      } else {
        obj.move_y = -mvy;
      }
    } else if (obj.y >= 0 && obj.y <= this.stage_height) {
      if (Math.random() < 0.5) {
        obj.move_y = mvy;
      } else {
        obj.move_y = -mvy;
      }
    } else if (obj.y <= 0) {
      obj.move_y = mvy;
    } else if (obj.y >= this.stage_height) {
      obj.move_y = -mvy;
    }
  }

  this.move_pattern_check = move_pattern_check;
  function move_pattern_check(obj) {
    if (this.esa_ar.length > 0) {
      if (!obj.target || this.esa_ar.indexOf(obj.target) < 0) {
        var dis = 0;
        var dis_i = 0;
        for (let esa_i = 0; esa_i < this.esa_ar.length; esa_i++) {
          dis2 = Math.sqrt(
            Math.pow(obj.x - this.esa_ar[esa_i].x, 2) +
              Math.pow(obj.x - this.esa_ar[esa_i].y, 2)
          );
          if (dis > dis2) {
            dis = dis2;
            dis_i = esa_i;
          }
        }
        obj.target = this.esa_ar[dis_i];
      }
      this.move_pattern(obj, obj.target);
    } else if (
      obj.x <= 0 ||
      obj.x >= this.stage_width ||
      obj.y <= 0 ||
      obj.y >= this.stage_height
    ) {
      this.move_pattern(obj);
    } else if (obj.step >= obj.step_limit) {
      this.move_pattern(obj);
    }
    obj.angle = Math.atan2(
      obj.y + obj.move_y - obj.y,
      obj.x + obj.move_x - obj.x
    );
    obj.x += obj.move_x;
    obj.y += obj.move_y;
    obj.step++;
    return obj;
  }
};

Math.easeOutCubic = function (t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
};
