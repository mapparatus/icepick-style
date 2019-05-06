const styleSpec = require("@mapbox/mapbox-gl-style-spec");


module.exports = function (newDoc) {
  const specVersion = `v${newDoc.version}`;
  const spec = styleSpec[specVersion];

  if (!spec) {
    throw new Error(`No such spec version '${specVersion}'`);
  }

  const errors = styleSpec.validate(newDoc, styleSpec[specVersion]);
  if (errors.length > 0) {
    const err = new Error("Invalid style");
    err.errors = errors;
    throw err;
  }
};

