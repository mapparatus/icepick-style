const assert = require("assert");
const IcepickMapboxStyle = require("../");


const emptyStyle = {
  "version": 8,
  "name": "",
  "metadata": {},
  "sources": {},
  "glyphs": "",
  "sprites": "",
  "layers": []
}

const tests = [
  {
    initial: emptyStyle,
    changeFn: function(obj) {
      obj.modifyRoot("name", "Foo bar");
    },
    expect: {
      "version": 8,
      "name": "Foo bar",
      "metadata": {},
      "sources": {},
      "glyphs": "",
      "sprites": "",
      "layers": []
    }
  },
  {
    initial: emptyStyle,
    changeFn: function(obj) {
      obj.modifyRoot("light", {
        "anchor": "viewport",
        "color": "white",
        "intensity": 0.4
      })
    },
    expect: {
      "version": 8,
      "name": "",
      "metadata": {},
      "light": {
        "anchor": "viewport",
        "color": "white",
        "intensity": 0.4
      },
      "sources": {},
      "glyphs": "",
      "sprites": "",
      "layers": []
    }
  },
  {
    initial: emptyStyle,
    changeFn: function(obj) {
      obj.modifyLayer("background", {
        "type": "background",
        "layout": {
          "visibility": "visible",
        },
        "paint": {
          "background-color": "#000000",
        }
      })
    },
    expect: {
      "version": 8,
      "name": "",
      "metadata": {},
      "sources": {},
      "glyphs": "",
      "sprites": "",
      "layers": [
        {
          "type": "background",
          "id": "background",
          "layout": {
            "visibility": "visible",
          },
          "paint": {
            "background-color": "#000000",
          }
        }
      ]
    }
  }
]

describe("icepick-mapbox-style", function() {
  tests.forEach(function(testObj, idx) {
    const label = `test ${idx}`;

    it(label, function() {
      const style = new IcepickMapboxStyle(testObj.initial);

      testObj.changeFn(style);

      assert.deepEqual(
        testObj.expect,
        style.current
      );
    })
  });
});

