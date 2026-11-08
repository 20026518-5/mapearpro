//#region node_modules/@chevrotain/utils/lib/src/print.js
function PRINT_ERROR(msg) {
	/* istanbul ignore else - can't override global.console in node.js */
	if (console && console.error) console.error(`Error: ${msg}`);
}
function PRINT_WARNING(msg) {
	/* istanbul ignore else - can't override global.console in node.js*/
	if (console && console.warn) console.warn(`Warning: ${msg}`);
}
//#endregion
//#region node_modules/@chevrotain/utils/lib/src/timer.js
function timer(func) {
	const start = (/* @__PURE__ */ new Date()).getTime();
	const val = func();
	return {
		time: (/* @__PURE__ */ new Date()).getTime() - start,
		value: val
	};
}
//#endregion
//#region node_modules/@chevrotain/utils/lib/src/to-fast-properties.js
function toFastProperties(toBecomeFast) {
	function FakeConstructor() {}
	FakeConstructor.prototype = toBecomeFast;
	const fakeInstance = new FakeConstructor();
	function fakeAccess() {
		return typeof fakeInstance.bar;
	}
	fakeAccess();
	fakeAccess();
	return toBecomeFast;
}
//#endregion
export { PRINT_WARNING as i, timer as n, PRINT_ERROR as r, toFastProperties as t };
