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

function modCheck(style) {
  assert.equal(style.history.length, 2);
  assert(style.history[1] === style.current);
  assert(style.history[0].sources === style.current.sources);
  assert(style.history[0].layers === style.current.layers);
}

describe("icepick-mapbox-style", () => {

  describe("root", () => {

    describe("modifyRoot", () => {

      describe("name (string)", () => {
        it("new", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": []
          });

          style.modifyRoot("name", "Foo bar");
          assert.equal(style.current.name, "Foo bar");
          modCheck(style);
        });

        it("modify", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "name": "original",
            "sources": {},
            "layers": []
          });

          style.modifyRoot("name", "new");
          assert.equal(style.current.name, "new");
          modCheck(style);
        });

        it("noop", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "name": "original",
            "sources": {},
            "layers": []
          });

          style.modifyRoot("name", "original");
          assert.equal(style.current, style.history[0]);
          assert.equal(style.history.length, 1)
        });

      });

      describe("metadata (object)", () => {
        it("new", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": []
          });

          style.modifyRoot("metadata", {foo: 3});
          assert.equal(style.current.metadata.foo, 3);
          modCheck(style);
        });

        it("modify", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": [],
            "metadata": {
              foo: "testing",
              bar: {
                subNonMod: 123,
                subMod: 456
              },
              baz: {}
            }
          });

          style.modifyRoot("metadata", {
            foo: "altered",
            bar: {
              subNonMod: 123,
              subMod: 100
            },
            baz: {}
          });
          assert.equal(style.current.metadata.foo, "altered");
          assert.equal(style.current.metadata.bar.subNonMod, style.history[0].metadata.bar.subNonMod);
          assert.equal(style.current.metadata.bar.subMod, 100);
          assert.equal(style.current.metadata.baz, style.history[0].metadata.baz);
          modCheck(style);
        });

        it("noop ", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": [],
            "metadata": {
              foo: "testing",
              bar: {
                subNonMod: 123,
                subMod: 456
              },
              baz: {}
            }
          });

          style.modifyRoot("metadata", {
            foo: "testing",
            bar: {
              subNonMod: 123,
              subMod: 456
            },
            baz: {}
          });

          assert.equal(style.history.length, 1);
        });
      });

      describe("center (array)", () => {
        it("new", () => {});
        it("modify", () => {});
        it("noop ", () => {});
      });

      describe("zoom (number)", () => {
        it("new", () => {});
        it("modify", () => {});
        it("noop ", () => {});
      });

    });

    describe("removeRoot", () => {

      describe("name (string)", () => {

        it("existing", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": [],
            "name": "testing"
          });

          assert(style.current.hasOwnProperty("name"));
          style.removeRoot("name");
          assert(!style.current.hasOwnProperty("name"));
          modCheck(style);
        });

        it("non existing", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": []
          });

          style.removeRoot("name");
          assert.equal(style.history.length, 1);
        });

      });

      describe("metadata (object)", () => {

        it("existing", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": [],
            "metadata": {
              foo: "bar"
            }
          });

          assert(style.current.hasOwnProperty("metadata"));
          style.removeRoot("metadata");
          assert(!style.current.hasOwnProperty("metadata"));
          modCheck(style);
        });

        it("non existing", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": []
          });

          style.removeRoot("name");
          assert.equal(style.history.length, 1);
        });

      });

      describe("center (array)", () => {

        it("existing", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": [],
            "center": [1, 2]
          });

          assert(style.current.hasOwnProperty("center"));
          style.removeRoot("center");
          assert(!style.current.hasOwnProperty("center"));
          modCheck(style);
        });

        it("non existing", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": []
          });

          style.removeRoot("name");
          assert.equal(style.history.length, 1);
        });

      });

      describe("zoom (number)", () => {

        it("existing", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": [],
            "zoom": 2
          });

          assert(style.current.hasOwnProperty("zoom"));
          style.removeRoot("zoom");
          assert(!style.current.hasOwnProperty("zoom"));
          modCheck(style);
        });

        it("non existing", () => {
          const style = new IcepickMapboxStyle({
            "version": 8,
            "sources": {},
            "layers": []
          });

          style.removeRoot("name");
          assert.equal(style.history.length, 1);
        });

      });

    });

  });

  describe("source", () => {

    describe("modifySource", () => {

      it.only("new with no existing sources", () => {
        const style = new IcepickMapboxStyle({
          "version": 8,
          "sources": {},
          "layers": [],
          "zoom": 2
        });

        style.modifySource("test-source", {
          "type": "vector",
          "url": "http://example.com"
        })

        assert.equal(style.history.length, 2);
      });

      it("new with existing sources", () => {
        throw "TODO";
      });

      it("modify", () => {
        throw "TODO";
      });

      it("noop", () => {
        throw "TODO";
      });

    });

    describe("renameSource", () => {

      it("missing id", () => {
        throw "TODO";
      });

      it("modify", () => {
        throw "TODO";
      });

      it("noop", () => {
        throw "TODO";
      });

    });

    describe("removeSource", () => {

      it("missing id", () => {
        throw "TODO";
      });

      it("valid id", () => {
        throw "TODO";
      });

    });

  });

  describe("layer", () => {

    describe("modifyLayer", () => {

      it("new no existing sources", () => {
        throw "TODO";
      });

      it("new with existing sources", () => {
        throw "TODO";
      });

      it("modify", () => {
        throw "TODO";
      });

      it("noop", () => {
        throw "TODO";
      });

    });

    describe("renameLayer", () => {

      it("missing id", () => {
        throw "TODO";
      });

      it("modify", () => {
        throw "TODO";
      });

      it("noop", () => {
        throw "TODO";
      });

    });

    describe("removeLayer", () => {

      it("missing id", () => {
        throw "TODO";
      });

      it("valid id", () => {
        throw "TODO";
      });

    });

  });

});

