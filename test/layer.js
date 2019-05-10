const assert = require("assert");
const IcepickStyle = require("../");


describe("layer", () => {

  describe("modifyLayer", () => {

    it("new no existing layers", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [],
      });

      style.modifyLayer("test-layer", {
        "type": "background"
      })

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "test-layer",
            "type": "background"
          }
        ],
      })

      assert.equal(style.current.sources, style.history[0].sources);
      assert.notEqual(style.current.layers, style.history[0].layers);
    });

    it("new with existing layers", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
          }
        ],
      });

      style.modifyLayer("test-layer", {
        "type": "background"
      })

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
          },
          {
            "id": "test-layer",
            "type": "background"
          }
        ],
      })

      assert.equal(style.current.sources, style.history[0].sources);
      assert.notEqual(style.current.layers, style.history[0].layers);
      assert.equal(style.current.layers[0], style.history[0].layers[0]);
    });

    it("modify", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "layout": {},
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ],
      });

      style.modifyLayer("foo", {
        "layout": {},
        "paint": {
          "background-color": "rgb(255,255,255)"
        }
      })

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "layout": {},
            "paint": {
              "background-color": "rgb(255,255,255)"
            }
          },
        ],
      })

      assert.equal(style.current.sources, style.history[0].sources);
      assert.notEqual(style.current.layers, style.history[0].layers);
      assert.notEqual(style.current.layers[0], style.history[0].layers[0]);
      assert.equal(style.current.layers[0].layout, style.history[0].layers[0].layout);
      assert.notEqual(style.current.layers[0].paint, style.history[0].layers[0].paint);
    });

    it("noop", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ],
      });

      style.modifyLayer("foo", {
        "paint": {
          "background-color": "rgb(0,0,0)"
        }
      })

      assert.equal(style.history.length, 1);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          },
        ],
      })

      assert.equal(style.current.sources, style.history[0].sources);
      assert.equal(style.current.layers, style.history[0].layers);
    });

  });

  describe("renameLayer", () => {

    it("missing id", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "baz",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ],
      });

      let err;
      try {
        style.renameLayer("foo", "bar");
      }
      catch (_err) {
        err = _err;
      }

      assert(err);
      assert.equal(err.message, "Missing layer: 'foo'");

      assert.equal(style.current.sources, style.history[0].sources);
      assert.equal(style.current.layers, style.history[0].layers);
    });

    it("modify", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "layout": {},
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ],
      });

      style.renameLayer("foo", "bar");
      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "bar",
            "type": "background",
            "layout": {},
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ],
      })

      assert.equal(style.current.sources, style.history[0].sources);
      assert.notEqual(style.current.layers, style.history[0].layers);
      assert.notEqual(style.current.layers[0], style.history[0].layers[0]);
      assert.equal(style.current.layers[0].layout, style.history[0].layers[0].layout);
      assert.equal(style.current.layers[0].paint, style.history[0].layers[0].paint);
    });

    it("noop", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ],
      });

      style.renameLayer("foo", "foo");
      assert.equal(style.history.length, 1);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ],
      })

      assert.equal(style.current.sources, style.history[0].sources);
      assert.equal(style.current.layers, style.history[0].layers);
      assert.equal(style.current.layers[0], style.history[0].layers[0]);
    });

  });

  describe("removeLayer", () => {

    it("missing id", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ],
      });

      style.removeLayer("bar");
      assert.equal(style.history.length, 1);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ],
      })

      assert.equal(style.current.sources, style.history[0].sources);
      assert.equal(style.current.layers, style.history[0].layers);
    });

    it("valid id", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          },
          {
            "id": "bar",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          },
          {
            "id": "baz",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ]
      });

      style.removeLayer("bar");
      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {},
        "layers": [
          {
            "id": "foo",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          },
          {
            "id": "baz",
            "type": "background",
            "paint": {
              "background-color": "rgb(0,0,0)"
            }
          }
        ]
      })

      assert.equal(style.current.sources, style.history[0].sources);
      assert.notEqual(style.current.layers, style.history[0].layers);
      assert.equal(style.current.layers[0], style.history[0].layers[0]);
      assert.equal(style.current.layers[1], style.history[0].layers[2]);
    });

  });

});
