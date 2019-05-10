const assert = require("assert");
const IcepickStyle = require("../");
const mapboxGlUpdateHook = require("../hooks/validate/mapbox-gl");

describe("hooks", () => {
  it("addHook/removeHook()", () => {
    const style = new IcepickStyle();
    const hookFn1 = () => {};
    const hookFn2 = () => {};
    const hookFn3 = () => {};
    style.addHook('validate', hookFn1);
    style.addHook('validate', hookFn2);
    style.addHook('validate', hookFn3);
    assert.deepEqual(style._hooks, {
      validate: [hookFn1, hookFn2, hookFn3]
    });

    style.removeHook('validate', hookFn2);
    assert.equal(style._hooks.validate.length, 2)
    assert.equal(style._hooks.validate[0], hookFn1);
    assert.equal(style._hooks.validate[1], hookFn3);
  });

  ["addHook", "removeHook"].forEach((fnName) => {
    it(`${fnName}(INVALID)`, () => {
      const style = new IcepickStyle();
      let err;
      try {
        style[fnName]("foo", () => {});
      }
      catch (_err) {
        err = _err;
      }
      assert(err);
      assert.equal(err.message, "Invalid hook type: foo");
    });
  });

  it("hook:validate errors", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
    });

    const errors = ["TEST_ERR"];

    style.addHook("validate", (newDoc, currentDoc) => {
      return errors;
    })

    style.modifyRoot("metadata", {foo: "bar"});
    assert.equal(style.valid, false);
    assert.deepEqual(style.errors, errors);
  });

  it("hook:validate no errors", () => {
    const style = new IcepickStyle({
      "version": 8,
      "sources": {},
      "layers": [],
    });

    style.addHook("validate", (newDoc, currentDoc) => {
      return null;
    })

    style.modifyRoot("metadata", {foo: "bar"});
    assert.equal(style.valid, true);
    assert.deepEqual(style.errors, []);
  });

  describe("hooks:validate/mapbox-gl", () => {
    it("invalid version", () => {
      const style = new IcepickStyle({
        "version": 101,
        "sources": {},
        "layers": [],
      }, {
        hooks: {
          validate: [mapboxGlUpdateHook]
        }
      });

      assert.equal(style.valid, false);
      assert.equal(style.errors.length, 1);
      assert.deepEqual(style.errors, [
        {
          "message": "No such spec version found for 'v101'"
        }
      ]);
    });

    it("valid version", () => {
      const style = new IcepickStyle({
        "version": 8,
        "sources": {},
        "layers": [],
      });

      style.addHook("validate", mapboxGlUpdateHook);

      style.modifyLayer("foo", {
        "type": "background",
        "paint": 1,
      });

      assert.equal(style.valid, false);
      assert.equal(style.errors.length, 1);
      assert.deepEqual(style.errors, [
        {
          "message": "layers[0].paint: object expected, number found"
        }
      ]);
    });
  });
});
