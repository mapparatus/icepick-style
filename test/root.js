const assert = require("assert");
const IcepickMapboxStyle = require("../");


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
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "name": "Foo bar",
          "sources": {},
          "layers": []
        });
      });

      it("modify", () => {
        const style = new IcepickMapboxStyle({
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
      });

      it("noop", () => {
        const style = new IcepickMapboxStyle({
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

        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
          "metadata": {
            foo: 3
          }
        });
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
      });
    });

    describe("center (array)", () => {
      it("new", () => {
        const style = new IcepickMapboxStyle({
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
      });

      it("modify", () => {
        const style = new IcepickMapboxStyle({
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
      });

      it("noop ", () => {
        const style = new IcepickMapboxStyle({
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
      });
    });

    describe("zoom (number)", () => {
      it("new", () => {
        const style = new IcepickMapboxStyle({
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
      });

      it("modify", () => {
        const style = new IcepickMapboxStyle({
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
      });

      it("noop ", () => {
        const style = new IcepickMapboxStyle({
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
      });
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

        style.removeRoot("name");
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });
      });

      it("non existing", () => {
        const style = new IcepickMapboxStyle({
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

        style.removeRoot("metadata");
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });
      });

      it("non existing", () => {
        const style = new IcepickMapboxStyle({
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

        style.removeRoot("center");
        assert.equal(style.history.length, 2);
        assert.deepEqual(style.current, {
          "version": 8,
          "sources": {},
          "layers": [],
        });
      });

      it("non existing", () => {
        const style = new IcepickMapboxStyle({
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
      });

    });

    describe("zoom (number)", () => {

      it("existing", () => {
        const style = new IcepickMapboxStyle({
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
      });

      it("non existing", () => {
        const style = new IcepickMapboxStyle({
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
      });

    });

  });

});
