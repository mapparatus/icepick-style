const assert = require("assert");
const IcepickStyle = require("../");


describe("root", () => {

  describe("invalid keys", () => {
    [
      ["modifyRoot", "modify"],
      ["removeRoot", "remove"],
    ].forEach(([fnName, modName]) => {
      describe(fnName, () => {
        ["layers", "sources"].forEach((key) => {
          it(key, () => {
            const style = new IcepickStyle({
              "version": 8,
              "sources": {},
              "layers": []
            });

            let err;
            try {
              style[fnName](key, "foo")
            }
            catch (_err) {
              err = _err;
            }

            assert(err);
            assert.equal(err.message, `Can't ${modName} ${key} use ${modName}* methods instead`);
          });
        });
      });
    });
  });

  describe("modifyRoot", () => {

    describe("name (string)", () => {
      it("new", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": []
        });

        style.modifyRoot("name", "Foo bar");
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "name": "Foo bar",
          "sources": {},
          "layers": []
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

      it("modify", () => {
        const style = new IcepickStyle({
          "version": 8,
          "name": "original",
          "sources": {},
          "layers": []
        });

        style.modifyRoot("name", "Foo bar");
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "name": "Foo bar",
          "sources": {},
          "layers": []
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

      it("noop", () => {
        const style = new IcepickStyle({
          "version": 8,
          "name": "original",
          "sources": {},
          "layers": []
        });

        style.modifyRoot("name", "original");
        assert.equal(style.history.length, 1);
        assert.deepEqual(style.current, {
          "version": 8,
          "name": "original",
          "sources": {},
          "layers": []
        });

        assert.equal(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

    });

    describe("metadata (object)", () => {
      it("new", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": []
        });

        style.modifyRoot("metadata", {foo: 3});

        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
          "metadata": {
            foo: 3
          }
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

      it("modify", () => {
        const style = new IcepickStyle({
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

        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
          "metadata": {
            foo: "altered",
            bar: {
              subNonMod: 123,
              subMod: 100
            },
            baz: {}
          }
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
        assert.notEqual(style.current.metadata, style.history[0].metadata);
        assert.equal(style.current.metadata.baz, style.history[0].metadata.baz);
      });

      it("noop", () => {
        const style = new IcepickStyle({
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
        assert.deepEqual(style.current, {
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
        })

        assert.equal(style.current, style.history[0]);
      });
    });

    describe("center (array)", () => {
      it("new", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
        });

        style.modifyRoot("center", [0.222, 1.222]);

        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
          "center": [0.222, 1.222]
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
        assert.notEqual(style.current.center, style.history[0].center);
      });

      it("modify", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
          "center": [0.111, 1.111]
        });

        style.modifyRoot("center", [0.222, 1.222]);

        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
          "center": [0.222, 1.222]
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);

        // Note: We currently replace arrays if they differ
        assert.notEqual(style.current.center, style.history[0].center);
      });

      it("noop ", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
          "center": [0.111, 1.111]
        });

        style.modifyRoot("center", [0.111, 1.111]);

        assert.equal(style.history.length, 1);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
          "center": [0.111, 1.111]
        });

        assert.equal(style.current, style.history[0]);
      });
    });

    describe("zoom (number)", () => {
      it("new", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
        });

        style.modifyRoot("zoom", 2);

        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
          "zoom": 2
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

      it("modify", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
          "zoom": 1,
        });

        style.modifyRoot("zoom", 2);

        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
          "zoom": 2
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

      it("noop ", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
          "zoom": 2,
        });

        style.modifyRoot("zoom", 2);

        assert.equal(style.history.length, 1);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
          "zoom": 2
        });

        assert.equal(style.current, style.history[0]);
      });
    });

  });

  describe("removeRoot", () => {

    describe("name (string)", () => {
      it("existing", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
          "name": "testing"
        });

        style.removeRoot("name");
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

      it("non existing", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
        });

        style.removeRoot("name");
        assert.equal(style.history.length, 1);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });

        assert.equal(style.current, style.history[0]);
      });

    });

    describe("metadata (object)", () => {

      it("existing", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
          "metadata": {
            foo: "bar"
          }
        });

        style.removeRoot("metadata");
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

      it("non existing", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
        });

        style.removeRoot("metadata");
        assert.equal(style.history.length, 1);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });

        assert.equal(style.current, style.history[0]);
      });

    });

    describe("center (array)", () => {

      it("existing", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
          "center": [1, 2]
        });

        style.removeRoot("center");
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

      it("non existing", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": []
        });

        style.removeRoot("metadata");
        assert.equal(style.history.length, 1);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });

        assert.equal(style.current, style.history[0]);
      });

    });

    describe("zoom (number)", () => {

      it("existing", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
          "zoom": 2,
        });

        style.removeRoot("zoom");
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });

        assert.notEqual(style.current, style.history[0]);
        assert.equal(style.current.sources, style.history[0].sources);
        assert.equal(style.current.layers, style.history[0].layers);
      });

      it("non existing", () => {
        const style = new IcepickStyle({
          "version": 8,
          "sources": {},
          "layers": [],
        });

        style.removeRoot("zoom");
        assert.equal(style.history.length, 1);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });

        assert.equal(style.current, style.history[0]);
      });

    });

  });

});
