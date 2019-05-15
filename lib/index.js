const icepick = require('icepick');

const INVALID_ROOT_KEYS = ['layers', 'sources'];

const VALID_HOOKS = ['validate'];

const DEFAULT_STYLE = {
	version: 8,
	sources: {},
	layers: []
};

class IcepickStyle {
	constructor(inputStyle, opts = {}) {
		opts = {
			maxHistoryLength: 100,
			hooks: {},
			...opts
		};

		this._hooks = {};
		this._maxHistoryLength = opts.maxHistoryLength;

		VALID_HOOKS.forEach(key => {
			if (opts.hooks[key] && Array.isArray(opts.hooks[key])) {
				this._hooks[key] = [].concat(opts.hooks[key]);
			} else {
				this._hooks[key] = [];
			}
		});

		if (inputStyle) {
			if (
				Array.isArray(inputStyle.sources) ||
				!typeof inputStyle.sources === 'object'
			) {
				throw new TypeError('style.sources must be an object');
			}

			if (!Array.isArray(inputStyle.layers)) {
				throw new TypeError('style.layers must be an array');
			}
		}

		this.errors = [];
		this.valid = true;
		this.history = [];
		this._pushHistory(inputStyle || DEFAULT_STYLE);
		this._historyIdx = 0;
	}

	_pushHistory(newDoc) {
		if (newDoc !== this.current) {
			this.errors = [];
			this._hooks.validate.forEach(hook => {
				const hookErrors = hook(newDoc, this.current);
				if (hookErrors) {
					this.errors = this.errors.concat(hookErrors);
				}
			});
			this.valid = this.errors.length < 1;

			let endIdx = 0;
			if (this._historyIdx < this.history.length) {
				endIdx = this.history.length;
			}

			this.history = icepick.splice(
				this.history,
				this._historyIdx + 1,
				endIdx,
				newDoc
			);
			this._historyIdx = this.history.length - 1;
			this.current = newDoc;
		}
	}

	_assertValidHook(key) {
		if (VALID_HOOKS.indexOf(key) < 0) {
			throw new Error('Invalid hook type: ' + key);
		}
	}

	/*
	 * General methods
	 */
	addHook(key, fn) {
		this._assertValidHook(key);
		this._hooks[key].push(fn);
	}

	removeHook(key, fn) {
		this._assertValidHook(key);
		this._hooks[key] = this._hooks[key].filter(_fn => {
			return _fn !== fn;
		});
	}

	merge(obj) {
		const newDoc = icepick.merge(this.current, obj);
		this._pushHistory(newDoc);
	}

	canUndo() {
		return this._historyIdx > 0;
	}

	undo() {
		if (!this.canUndo()) {
			throw new Error('No items to undo in stack');
		}

		this._historyIdx--;
		this.current = this.history[this._historyIdx];
	}

	canRedo() {
		return this._historyIdx < this.history.length - 1;
	}

	redo() {
		if (!this.canRedo()) {
			throw new Error('No items to redo in stack');
		}

		this._historyIdx++;
		this.current = this.history[this._historyIdx];
	}

	/*
	 * Style functions
	 */
	addRoot(key, obj) {
		if (INVALID_ROOT_KEYS.indexOf(key) > -1) {
			throw new Error(`Can't add ${key} use add* methods instead`);
		}

		if (Object.prototype.hasOwnProperty.call(this.current, key)) {
			throw new Error('Already has root element');
		}

		return this.modifyRoot(key, obj);
	}

	modifyRoot(key, obj) {
		if (INVALID_ROOT_KEYS.indexOf(key) > -1) {
			throw new Error(`Can't modify ${key} use modify* methods instead`);
		}

		const currentValue = this.current[key];
		let newDoc;

		if (typeof currentValue === 'object') {
			newDoc = icepick.setIn(
				this.current,
				[key],
				icepick.replace(this.current[key], obj)
			);
		} else {
			newDoc = icepick.setIn(this.current, [key], obj);
		}

		this._pushHistory(newDoc);
		return this;
	}

	removeRoot(key) {
		if (INVALID_ROOT_KEYS.indexOf(key) > -1) {
			throw new Error(`Can't remove ${key} use remove* methods instead`);
		}

		if (Object.prototype.hasOwnProperty.call(this.current, key)) {
			const newDoc = icepick.unsetIn(this.current, [key]);
			this._pushHistory(newDoc);
		}

		return this;
	}

	addSource(id, arg) {
		if (Object.prototype.hasOwnProperty.call(this.current.sources, id)) {
			throw new Error('Style already has source named \'' + id + '\'');
		}

		return this.modifySource(id, arg);
	}

	modifySource(id, arg) {
		const newDoc = icepick.setIn(
			this.current,
			['sources', id],
			icepick.replace(this.current.sources[id] || {}, arg)
		);
		this._pushHistory(newDoc);
		return this;
	}

	// TODO
	// mergeSource(id, arg) {
	// 	const newDoc = icepick.setIn(
	// 		this.current,
	// 		['sources', id],
	// 		icepick.merge(this.current.sources[id] || {}, arg)
	// 	);
	// 	this._pushHistory(newDoc);
	// 	return this;
	// }

	renameSource(currentId, newId) {
		if (
			!Object.prototype.hasOwnProperty.call(this.current.sources, currentId)
		) {
			throw new Error(`Missing source: '${currentId}'`);
		}

		if (currentId !== newId) {
			const source = this.current.sources[currentId];
			const change1 = icepick.unsetIn(this.current, ['sources', currentId]);

			const change2 = icepick.setIn(change1, ['sources', newId], source);

			this._pushHistory(change2);
		}

		return this;
	}

	removeSource(id) {
		if (!Object.prototype.hasOwnProperty.call(this.current.sources, id)) {
			throw new Error(`Missing source: '${id}'`);
		}

		const newDoc = icepick.unsetIn(this.current, ['sources', id]);
		this._pushHistory(newDoc);
		return this;
	}

	_findLayerIdxById(id, _default = -1) {
		const idx = this.current.layers.findIndex(layer => {
			return layer.id === id;
		});
		if (idx < 0) {
			return _default;
		}

		return idx;
	}

	addLayer(id, arg) {
		const idx = this._findLayerIdxById(id);
		if (idx > -1) {
			throw new Error('Layer already exists');
		}

		const doc = this.current;

		const newDoc = icepick.setIn(
			doc,
			['layers', this.current.layers.length],
			{...arg, id}
		);

		this._pushHistory(newDoc);
		return this;
	}

	modifyLayer(id, arg) {
		const idx = this._findLayerIdxById(id, this.current.layers.length);
		const doc = this.current;

		const newDoc = icepick.setIn(
			doc,
			['layers', idx],
			icepick.replace(this.current.layers[idx] || {}, {id, ...arg})
		);

		this._pushHistory(newDoc);
		return this;
	}

	// TODO
	// mergeLayer(id, arg) {
	// 	const idx = this._findLayerIdxById(id, this.current.layers.length);
	// 	const doc = this.current;

	// 	const newDoc = icepick.setIn(
	// 		doc,
	// 		['layers', idx],
	// 		icepick.merge(this.current.layers[idx] || {}, {...arg, id})
	// 	);

	// 	this._pushHistory(newDoc);
	// 	return this;
	// }

	renameLayer(oldId, newId) {
		if (oldId !== newId) {
			const idx = this._findLayerIdxById(oldId);
			if (idx < 0) {
				throw new Error(`Missing layer: '${oldId}'`);
			}

			const newDoc = icepick.setIn(
				this.current,
				['layers', idx],
				icepick.merge(this.current.layers[idx], {id: newId})
			);
			this._pushHistory(newDoc);
		}

		return this;
	}

	removeLayer(id) {
		const idx = this._findLayerIdxById(id);

		if (idx > -1) {
			const newDoc = icepick.setIn(
				this.current,
				['layers'],
				icepick.splice(this.current.layers, idx, idx)
			);
			this._pushHistory(newDoc);
		}

		return this;
	}
}

module.exports = IcepickStyle;
