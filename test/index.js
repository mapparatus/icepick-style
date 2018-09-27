const assert = require("assert");
const ImmuatableStyle = require("../");


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
      obj.changeRoot("name", "Foo bar");
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
      obj.changeRoot("light", {
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
      obj.addLayer({
        "type": "background",
        "id": "background",
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

describe("immuatable-style", function() {
  tests.forEach(function(testObj, idx) {
    const label = `test ${idx}`;

    it(label, function() {
      const obj = new ImmuatableStyle(testObj.initial);

      testObj.changeFn(obj);
      const objJSON = obj.toJSON()

      assert.deepEqual(
        testObj.expect,
        objJSON
      );

      assert.deepEqual(
        testObj.expect,
        obj._data.toJSON()
      );
    })
  });
});
