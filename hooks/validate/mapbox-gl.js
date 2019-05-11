const styleSpec = require('@mapbox/mapbox-gl-style-spec');

module.exports = function (newDoc) {
	const specVersion = `v${newDoc.version}`;
	const spec = styleSpec[specVersion];

	if (!spec) {
		return [
			{
				message: `No such spec version found for '${specVersion}'`
			}
		];
	}

	return styleSpec.validate(newDoc, styleSpec[specVersion]);
};
