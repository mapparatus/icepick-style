const assert = require("assert");
const IcepickMapboxStyle = require("../");


describe("source", () => {

  describe("modifySource", () => {

    it("new with no existing sources", () => {
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
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test-source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      })
    });

    it("new with existing sources", () => {
      const style = new IcepickMapboxStyle({
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

      style.modifySource("test-source", {
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
          "test-source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      })
    });

    it("modify", () => {
      const style = new IcepickMapboxStyle({
        "version": 8,
        "sources": {
          "test-source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.modifySource("test-source", {
        "type": "vector",
        "url": "http://foo.example.com"
      })

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test-source": {
            "type": "vector",
            "url": "http://foo.example.com"
          }
        },
        "layers": [],
        "zoom": 2
      })
    });

    it("noop", () => {
      const style = new IcepickMapboxStyle({
        "version": 8,
        "sources": {
          "test-source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.modifySource("test-source", {
        "type": "vector",
        "url": "http://example.com"
      })

      assert.equal(style.history.length, 1);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test-source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      })
    });
  });

  describe("renameSource", () => {

    it("missing id", () => {
      const style = new IcepickMapboxStyle({
        "version": 8,
        "sources": {
          "test-source": {
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
          "test-source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });
    });

    it("modify", () => {
      const style = new IcepickMapboxStyle({
        "version": 8,
        "sources": {
          "test-source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.renameSource("test-source", "test-source-changed");

      assert.equal(style.history.length, 2);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test-source-changed": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

    });

    it("noop", () => {
      const style = new IcepickMapboxStyle({
        "version": 8,
        "sources": {
          "test-source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });

      style.renameSource("test-source", "test-source");

      assert.equal(style.history.length, 1);
      assert.deepEqual(style.current, {
        "version": 8,
        "sources": {
          "test-source": {
            "type": "vector",
            "url": "http://example.com"
          }
        },
        "layers": [],
        "zoom": 2
      });
    });

  });

  describe("removeSource", () => {

    it("missing id", () => {
      const style = new IcepickMapboxStyle({
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
        style.removeSource("test-source");
      }
      catch (_err) {
        err = _err;
      }

      assert(err);
      assert.equal(err.message, "Missing source: 'test-source'");
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
    });

    it("valid id", () => {
      const style = new IcepickMapboxStyle({
        "version": 8,
        "sources": {
          "test-source": {
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

      style.removeSource("test-source");

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
    });

  });

});
