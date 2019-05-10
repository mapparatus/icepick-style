const assert = require("assert");
const IcepickStyle = require("../");


describe("source", () => {

  describe("modifySource", () => {

    it("new with no existing sources", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [],
        "zoom": 2
      });

      style.modifySource("test_source", {
        "type": "vector",
        "url": "http://example.com"
      })

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      })

      assert.equal(style.current.layers, style.history[0].layers);
      assert.notEqual(style.current.sources, style.history[0].sources);
    });

    it("new with existing sources", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {
          "foo": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.modifySource("test_source", {
        "type": "vector",
        "url": "http://example.com"
      })

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "foo": {
            "type": "vector",
            "url": "http://example.com"
          },
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      })

      assert.equal(style.current.layers, style.history[0].layers);
      assert.notEqual(style.current.sources, style.history[0].sources);
      assert.equal(style.current.sources.foo, style.history[0].sources.foo);
    });

    it("modify", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.modifySource("test_source", {
        "type": "vector",
        "url": "http://foo.example.com"
      })

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://foo.example.com"
          }
        },
        "layers": [],
        "zoom": 2
      })

      assert.equal(style.current.layers, style.history[0].layers);
      assert.notEqual(style.current.sources, style.history[0].sources);
      assert.notEqual(style.current.sources.test_source, style.history[0].sources.test_source);
    });

    it("noop", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.modifySource("test_source", {
        "type": "vector",
        "url": "http://example.com"
      })

      assert.equal(style.history.length, 1);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      })

      assert.equal(style.current.layers, style.history[0].layers);
      assert.equal(style.current.sources, style.history[0].sources);
      assert.equal(style.current.sources.test_source, style.history[0].sources.test_source);
    });
  });

  describe("renameSource", () => {

    it("missing id", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      let err;
      try {
        style.renameSource("foo", "bar");
      }
      catch (_err) {
        err = _err;
      }

      assert(err);
      assert.equal(err.message, "Missing source: 'foo'");
      assert.equal(style.history.length, 1);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      assert.equal(style.current.layers, style.history[0].layers);
      assert.equal(style.current.sources, style.history[0].sources);
      assert.equal(style.current.sources.test_source, style.history[0].sources.test_source);
    });

    it("modify", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.renameSource("test_source", "test_source_changed");

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test_source_changed": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      assert.equal(style.current.layers, style.history[0].layers);
      assert.notEqual(style.current.sources, style.history[0].sources);
      assert.equal(style.current.sources.test_source_changed, style.history[0].sources.test_source);
    });

    it("noop", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.renameSource("test_source", "test_source");

      assert.equal(style.history.length, 1);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      assert.equal(style.current.layers, style.history[0].layers);
      assert.equal(style.current.sources, style.history[0].sources);
      assert.equal(style.current.sources.test_source, style.history[0].sources.test_source);
    });

  });

  describe("removeSource", () => {

    it("missing id", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {
          "foo": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      let err;
      try {
        style.removeSource("test_source");
      }
      catch (_err) {
        err = _err;
      }

      assert(err);
      assert.equal(err.message, "Missing source: 'test_source'");
      assert.equal(style.history.length, 1);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "foo": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      assert.equal(style.current.layers, style.history[0].layers);
      assert.equal(style.current.sources, style.history[0].sources);
      assert.equal(style.current.sources.foo, style.history[0].sources.foo);
    });

    it("valid id", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {
          "test_source": {
            "type": "vector",
            "url": "http://example.com"
          },
          "foo": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.removeSource("test_source");

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "foo": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      assert.equal(style.current.layers, style.history[0].layers);
      assert.notEqual(style.current.sources, style.history[0].sources);
      assert.equal(style.current.sources.foo, style.history[0].sources.foo);
    });

  });

});
