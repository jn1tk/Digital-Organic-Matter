
# Digital Organic Matter (DOM)

I tried to express a life form like an amoeba on screen.


## Screenshots

http://dom.jntk.net/demo.html

![App Screenshot](http://dom.jntk.net/screenshot/main.png)


## Usage/Examples

```javascript
var _base = new domBase();
_base.init();
```

### Parameters
```javascript
domBase(num,tile,stage);
/*
num: Number of appearance
tile.color: Tile's color
tile.size: Tile's size
tile.gap: gap size between tile
stage.width
stage.height
*/
```

### Example: 
```javascript
var _base = new domBase(5,{size:10,gap:6},{width:300,height:300});
```

### ::Attention::
Making the tiles too small will increase the amount of redrawing, requiring more PC's power.
Also, even if the number of living organisms is too large, it requires PC's power.

## Demo

```javascript
var _base = new domBase(2,{size:3,gap:2},{width:200,height:200});
```

http://dom.jntk.net/demo.html?num=2&size=3&gap=2&w=200&h=200
![App Screenshot](http://dom.jntk.net/screenshot/1.png)



```javascript
var _base = new domBase(null,{size:6,gap:4},{width:400,height:200});
```

http://dom.jntk.net/demo.html?size=6&gap=4&w=400&h=200
![App Screenshot](http://dom.jntk.net/screenshot/2.png)



