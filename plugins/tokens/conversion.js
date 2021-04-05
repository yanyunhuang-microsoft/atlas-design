/**
 * Convert a Sass rule or subrule into a token friendly format.
 * @param {import('./types').SassRule} rule A rule generated by convert-sass
 * @param {string} name The name of the token.
 * @param {boolean} isSubProp Whether this item is a subproperty of a map.
 * @returns any
 */
function convertSassVariable(rule, name, isSubProp = false) {
	switch (rule.type) {
		case 'SassString':
			return convertString(name, rule, isSubProp);
		case 'SassNumber':
			return convertNumber(name, rule, isSubProp);
		case 'SassList':
			return convertList(name, rule, isSubProp);
		case 'SassMap':
			return convertMap(name, rule, isSubProp);
		case 'SassColor':
			return convertColor(name, rule, isSubProp);
		case 'SassBoolean':
			return convertBool(name, rule, isSubProp);
		default:
			throw new Error(`Unexpected Sass type encountered: ${JSON.stringify(rule)}`);
	}
}

/**
 * Converts to string rule into a token friendly object
 * @param {string} name The Sass variable Name
 * @param {import("./types").SassStringRule} rule
 */
function convertString(name, rule) {
	if (!name) {
		return rule.value;
	}
	return { [name]: rule.value };
}

/**
 * Converts to string rule into a token friendly object
 * @param {string} name The Sass variable Name
 * @param {import("./types").SassNumberRule} rule
 */
function convertNumber(name, rule) {
	const value = `${rule.value}${rule.unit || ''}`;
	if (!name) {
		return value;
	}
	return { [name]: value };
}

/**
 * Converts to array rule into a token friendly object
 * @param {string} name
 * @param {import("./types").SassListRule} rule
 */
function convertList(name, rule) {
	const value = rule.value.map(v => convertSassVariable(v, '', true));
	if (!name) {
		return value;
	}
	return { [name]: value };
}

/**
 * Converts a map rule into a token friendly object.
 * Recurses through subproperties to convert them.
 * @param {string} name
 * @param {import('./types').SassMapRule} rule
 */
function convertMap(name, rule, isSubprop) {
	const children = {};
	for (const subprop in rule.value) {
		children[subprop] = convertSassVariable(rule.value[subprop], '', true);
	}
	if (!name) {
		return children;
	}
	return { ...children };
}

/**
 * @param {string} name
 * @param {import("./types").SassColorRule} rule
 */
function convertBool(name, rule, isSubprop = false) {
	if (!name) {
		return rule.value;
	}
	return { [name]: rule.value };
}

/**
 * @param {string} name
 * @param {import("./types").SassColorRule} rule
 */
function convertColor(name, rule, isSubprop = false) {
	if (!name) {
		return rule.value;
	}

	return {
		[name]: {
			...rule.value
		}
	};
}

module.exports.convertSassVariable = convertSassVariable;
