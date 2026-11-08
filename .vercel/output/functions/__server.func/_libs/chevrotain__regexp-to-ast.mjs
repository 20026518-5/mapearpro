//#region node_modules/@chevrotain/regexp-to-ast/lib/src/utils.js
function cc(char) {
	return char.charCodeAt(0);
}
function insertToSet(item, set) {
	if (Array.isArray(item)) item.forEach(function(subItem) {
		set.push(subItem);
	});
	else set.push(item);
}
function addFlag(flagObj, flagKey) {
	if (flagObj[flagKey] === true) throw "duplicate flag " + flagKey;
	flagObj[flagKey];
	flagObj[flagKey] = true;
}
function ASSERT_EXISTS(obj) {
	// istanbul ignore next
	if (obj === void 0) throw Error("Internal Error - Should never get here!");
	return true;
}
// istanbul ignore next
function ASSERT_NEVER_REACH_HERE() {
	throw Error("Internal Error - Should never get here!");
}
function isCharacter(obj) {
	return obj["type"] === "Character";
}
//#endregion
//#region node_modules/@chevrotain/regexp-to-ast/lib/src/character-classes.js
var digitsCharCodes = [];
for (let i = cc("0"); i <= cc("9"); i++) digitsCharCodes.push(i);
var wordCharCodes = [cc("_")].concat(digitsCharCodes);
for (let i = cc("a"); i <= cc("z"); i++) wordCharCodes.push(i);
for (let i = cc("A"); i <= cc("Z"); i++) wordCharCodes.push(i);
var whitespaceCodes = [
	cc(" "),
	cc("\f"),
	cc("\n"),
	cc("\r"),
	cc("	"),
	cc("\v"),
	cc("	"),
	cc("\xA0"),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc(" "),
	cc("\u2028"),
	cc("\u2029"),
	cc(" "),
	cc(" "),
	cc("　"),
	cc("﻿")
];
//#endregion
//#region node_modules/@chevrotain/regexp-to-ast/lib/src/regexp-parser.js
var hexDigitPattern = /[0-9a-fA-F]/;
var decimalPattern = /[0-9]/;
var decimalPatternNoZero = /[1-9]/;
var RegExpParser = class {
	constructor() {
		this.idx = 0;
		this.input = "";
		this.groupIdx = 0;
	}
	saveState() {
		return {
			idx: this.idx,
			input: this.input,
			groupIdx: this.groupIdx
		};
	}
	restoreState(newState) {
		this.idx = newState.idx;
		this.input = newState.input;
		this.groupIdx = newState.groupIdx;
	}
	pattern(input) {
		this.idx = 0;
		this.input = input;
		this.groupIdx = 0;
		this.consumeChar("/");
		const value = this.disjunction();
		this.consumeChar("/");
		const flags = {
			type: "Flags",
			loc: {
				begin: this.idx,
				end: input.length
			},
			global: false,
			ignoreCase: false,
			multiLine: false,
			unicode: false,
			sticky: false
		};
		while (this.isRegExpFlag()) switch (this.popChar()) {
			case "g":
				addFlag(flags, "global");
				break;
			case "i":
				addFlag(flags, "ignoreCase");
				break;
			case "m":
				addFlag(flags, "multiLine");
				break;
			case "u":
				addFlag(flags, "unicode");
				break;
			case "y": addFlag(flags, "sticky");
		}
		if (this.idx !== this.input.length) throw Error("Redundant input: " + this.input.substring(this.idx));
		return {
			type: "Pattern",
			flags,
			value,
			loc: this.loc(0)
		};
	}
	disjunction() {
		const alts = [];
		const begin = this.idx;
		alts.push(this.alternative());
		while (this.peekChar() === "|") {
			this.consumeChar("|");
			alts.push(this.alternative());
		}
		return {
			type: "Disjunction",
			value: alts,
			loc: this.loc(begin)
		};
	}
	alternative() {
		const terms = [];
		const begin = this.idx;
		while (this.isTerm()) terms.push(this.term());
		return {
			type: "Alternative",
			value: terms,
			loc: this.loc(begin)
		};
	}
	term() {
		if (this.isAssertion()) return this.assertion();
		else return this.atom();
	}
	assertion() {
		const begin = this.idx;
		switch (this.popChar()) {
			case "^": return {
				type: "StartAnchor",
				loc: this.loc(begin)
			};
			case "$": return {
				type: "EndAnchor",
				loc: this.loc(begin)
			};
			case "\\":
				switch (this.popChar()) {
					case "b": return {
						type: "WordBoundary",
						loc: this.loc(begin)
					};
					case "B": return {
						type: "NonWordBoundary",
						loc: this.loc(begin)
					};
				}
				/* c8 ignore next */
				throw Error("Invalid Assertion Escape");
			case "(":
				this.consumeChar("?");
				let type;
				switch (this.popChar()) {
					case "=":
						type = "Lookahead";
						break;
					case "!":
						type = "NegativeLookahead";
						break;
					case "<": switch (this.popChar()) {
						case "=":
							type = "Lookbehind";
							break;
						case "!": type = "NegativeLookbehind";
					}
				}
				ASSERT_EXISTS(type);
				const disjunction = this.disjunction();
				this.consumeChar(")");
				return {
					type,
					value: disjunction,
					loc: this.loc(begin)
				};
		}
		// istanbul ignore next
		return ASSERT_NEVER_REACH_HERE();
	}
	quantifier(isBacktracking = false) {
		let range = void 0;
		const begin = this.idx;
		switch (this.popChar()) {
			case "*":
				range = {
					atLeast: 0,
					atMost: Infinity
				};
				break;
			case "+":
				range = {
					atLeast: 1,
					atMost: Infinity
				};
				break;
			case "?":
				range = {
					atLeast: 0,
					atMost: 1
				};
				break;
			case "{":
				const atLeast = this.integerIncludingZero();
				switch (this.popChar()) {
					case "}":
						range = {
							atLeast,
							atMost: atLeast
						};
						break;
					case ",":
						let atMost;
						if (this.isDigit()) {
							atMost = this.integerIncludingZero();
							range = {
								atLeast,
								atMost
							};
						} else range = {
							atLeast,
							atMost: Infinity
						};
						this.consumeChar("}");
				}
				if (isBacktracking === true && range === void 0) return;
				ASSERT_EXISTS(range);
		}
		if (isBacktracking === true && range === void 0) return;
		// istanbul ignore else
		if (ASSERT_EXISTS(range)) {
			if (this.peekChar(0) === "?") {
				this.consumeChar("?");
				range.greedy = false;
			} else range.greedy = true;
			range.type = "Quantifier";
			range.loc = this.loc(begin);
			return range;
		}
	}
	atom() {
		let atom;
		const begin = this.idx;
		switch (this.peekChar()) {
			case ".":
				atom = this.dotAll();
				break;
			case "\\":
				atom = this.atomEscape();
				break;
			case "[":
				atom = this.characterClass();
				break;
			case "(": atom = this.group();
		}
		if (atom === void 0 && this.isPatternCharacter()) atom = this.patternCharacter();
		// istanbul ignore else
		if (ASSERT_EXISTS(atom)) {
			atom.loc = this.loc(begin);
			if (this.isQuantifier()) atom.quantifier = this.quantifier();
			return atom;
		}
		// istanbul ignore next
		return ASSERT_NEVER_REACH_HERE();
	}
	dotAll() {
		this.consumeChar(".");
		return {
			type: "Set",
			complement: true,
			value: [
				cc("\n"),
				cc("\r"),
				cc("\u2028"),
				cc("\u2029")
			]
		};
	}
	atomEscape() {
		this.consumeChar("\\");
		switch (this.peekChar()) {
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9": return this.decimalEscapeAtom();
			case "d":
			case "D":
			case "s":
			case "S":
			case "w":
			case "W": return this.characterClassEscape();
			case "f":
			case "n":
			case "r":
			case "t":
			case "v": return this.controlEscapeAtom();
			case "c": return this.controlLetterEscapeAtom();
			case "0": return this.nulCharacterAtom();
			case "x": return this.hexEscapeSequenceAtom();
			case "u": return this.regExpUnicodeEscapeSequenceAtom();
			default: return this.identityEscapeAtom();
		}
	}
	decimalEscapeAtom() {
		return {
			type: "GroupBackReference",
			value: this.positiveInteger()
		};
	}
	characterClassEscape() {
		let set;
		let complement = false;
		switch (this.popChar()) {
			case "d":
				set = digitsCharCodes;
				break;
			case "D":
				set = digitsCharCodes;
				complement = true;
				break;
			case "s":
				set = whitespaceCodes;
				break;
			case "S":
				set = whitespaceCodes;
				complement = true;
				break;
			case "w":
				set = wordCharCodes;
				break;
			case "W":
				set = wordCharCodes;
				complement = true;
		}
		// istanbul ignore else
		if (ASSERT_EXISTS(set)) return {
			type: "Set",
			value: set,
			complement
		};
		// istanbul ignore next
		return ASSERT_NEVER_REACH_HERE();
	}
	controlEscapeAtom() {
		let escapeCode;
		switch (this.popChar()) {
			case "f":
				escapeCode = cc("\f");
				break;
			case "n":
				escapeCode = cc("\n");
				break;
			case "r":
				escapeCode = cc("\r");
				break;
			case "t":
				escapeCode = cc("	");
				break;
			case "v": escapeCode = cc("\v");
		}
		// istanbul ignore else
		if (ASSERT_EXISTS(escapeCode)) return {
			type: "Character",
			value: escapeCode
		};
		// istanbul ignore next
		return ASSERT_NEVER_REACH_HERE();
	}
	controlLetterEscapeAtom() {
		this.consumeChar("c");
		const letter = this.popChar();
		if (/[a-zA-Z]/.test(letter) === false) throw Error("Invalid ");
		return {
			type: "Character",
			value: letter.toUpperCase().charCodeAt(0) - 64
		};
	}
	nulCharacterAtom() {
		this.consumeChar("0");
		return {
			type: "Character",
			value: cc("\0")
		};
	}
	hexEscapeSequenceAtom() {
		this.consumeChar("x");
		return this.parseHexDigits(2);
	}
	regExpUnicodeEscapeSequenceAtom() {
		this.consumeChar("u");
		return this.parseHexDigits(4);
	}
	identityEscapeAtom() {
		return {
			type: "Character",
			value: cc(this.popChar())
		};
	}
	classPatternCharacterAtom() {
		switch (this.peekChar()) {
			// istanbul ignore next
			case "\n":
			// istanbul ignore next
			case "\r":
			// istanbul ignore next
			case "\u2028":
			// istanbul ignore next
			case "\u2029":
			// istanbul ignore next
			case "\\":
			// istanbul ignore next
			case "]": throw Error("TBD");
			default: return {
				type: "Character",
				value: cc(this.popChar())
			};
		}
	}
	characterClass() {
		const set = [];
		let complement = false;
		this.consumeChar("[");
		if (this.peekChar(0) === "^") {
			this.consumeChar("^");
			complement = true;
		}
		while (this.isClassAtom()) {
			const from = this.classAtom();
			from.type;
			if (isCharacter(from) && this.isRangeDash()) {
				this.consumeChar("-");
				const to = this.classAtom();
				to.type;
				if (isCharacter(to)) {
					if (to.value < from.value) throw Error("Range out of order in character class");
					set.push({
						from: from.value,
						to: to.value
					});
				} else {
					insertToSet(from.value, set);
					set.push(cc("-"));
					insertToSet(to.value, set);
				}
			} else insertToSet(from.value, set);
		}
		this.consumeChar("]");
		return {
			type: "Set",
			complement,
			value: set
		};
	}
	classAtom() {
		switch (this.peekChar()) {
			// istanbul ignore next
			case "]":
			// istanbul ignore next
			case "\n":
			// istanbul ignore next
			case "\r":
			// istanbul ignore next
			case "\u2028":
			// istanbul ignore next
			case "\u2029": throw Error("TBD");
			case "\\": return this.classEscape();
			default: return this.classPatternCharacterAtom();
		}
	}
	classEscape() {
		this.consumeChar("\\");
		switch (this.peekChar()) {
			case "b":
				this.consumeChar("b");
				return {
					type: "Character",
					value: cc("\b")
				};
			case "d":
			case "D":
			case "s":
			case "S":
			case "w":
			case "W": return this.characterClassEscape();
			case "f":
			case "n":
			case "r":
			case "t":
			case "v": return this.controlEscapeAtom();
			case "c": return this.controlLetterEscapeAtom();
			case "0": return this.nulCharacterAtom();
			case "x": return this.hexEscapeSequenceAtom();
			case "u": return this.regExpUnicodeEscapeSequenceAtom();
			default: return this.identityEscapeAtom();
		}
	}
	group() {
		let capturing = true;
		this.consumeChar("(");
		switch (this.peekChar(0)) {
			case "?":
				this.consumeChar("?");
				this.consumeChar(":");
				capturing = false;
				break;
			default: this.groupIdx++;
		}
		const value = this.disjunction();
		this.consumeChar(")");
		const groupAst = {
			type: "Group",
			capturing,
			value
		};
		if (capturing) groupAst["idx"] = this.groupIdx;
		return groupAst;
	}
	positiveInteger() {
		let number = this.popChar();
		// istanbul ignore next - can't ever get here due to previous lookahead checks
		if (decimalPatternNoZero.test(number) === false) throw Error("Expecting a positive integer");
		while (decimalPattern.test(this.peekChar(0))) number += this.popChar();
		return parseInt(number, 10);
	}
	integerIncludingZero() {
		let number = this.popChar();
		if (decimalPattern.test(number) === false) throw Error("Expecting an integer");
		while (decimalPattern.test(this.peekChar(0))) number += this.popChar();
		return parseInt(number, 10);
	}
	patternCharacter() {
		const nextChar = this.popChar();
		switch (nextChar) {
			// istanbul ignore next
			case "\n":
			// istanbul ignore next
			case "\r":
			// istanbul ignore next
			case "\u2028":
			// istanbul ignore next
			case "\u2029":
			// istanbul ignore next
			case "^":
			// istanbul ignore next
			case "$":
			// istanbul ignore next
			case "\\":
			// istanbul ignore next
			case ".":
			// istanbul ignore next
			case "*":
			// istanbul ignore next
			case "+":
			// istanbul ignore next
			case "?":
			// istanbul ignore next
			case "(":
			// istanbul ignore next
			case ")":
			// istanbul ignore next
			case "[":
			// istanbul ignore next
			case "|":
 // istanbul ignore next
			throw Error("TBD");
			default: return {
				type: "Character",
				value: cc(nextChar)
			};
		}
	}
	isRegExpFlag() {
		switch (this.peekChar(0)) {
			case "g":
			case "i":
			case "m":
			case "u":
			case "y": return true;
			default: return false;
		}
	}
	isRangeDash() {
		return this.peekChar() === "-" && this.isClassAtom(1);
	}
	isDigit() {
		return decimalPattern.test(this.peekChar(0));
	}
	isClassAtom(howMuch = 0) {
		switch (this.peekChar(howMuch)) {
			case "]":
			case "\n":
			case "\r":
			case "\u2028":
			case "\u2029": return false;
			default: return true;
		}
	}
	isTerm() {
		return this.isAtom() || this.isAssertion();
	}
	isAtom() {
		if (this.isPatternCharacter()) return true;
		switch (this.peekChar(0)) {
			case ".":
			case "\\":
			case "[":
			case "(": return true;
			default: return false;
		}
	}
	isAssertion() {
		switch (this.peekChar(0)) {
			case "^":
			case "$": return true;
			case "\\": switch (this.peekChar(1)) {
				case "b":
				case "B": return true;
				default: return false;
			}
			case "(": return this.peekChar(1) === "?" && (this.peekChar(2) === "=" || this.peekChar(2) === "!" || this.peekChar(2) === "<" && (this.peekChar(3) === "=" || this.peekChar(3) === "!"));
			default: return false;
		}
	}
	isQuantifier() {
		const prevState = this.saveState();
		try {
			return this.quantifier(true) !== void 0;
		} catch (e) {
			return false;
		} finally {
			this.restoreState(prevState);
		}
	}
	isPatternCharacter() {
		switch (this.peekChar()) {
			case "^":
			case "$":
			case "\\":
			case ".":
			case "*":
			case "+":
			case "?":
			case "(":
			case ")":
			case "[":
			case "|":
			case "/":
			case "\n":
			case "\r":
			case "\u2028":
			case "\u2029": return false;
			default: return true;
		}
	}
	parseHexDigits(howMany) {
		let hexString = "";
		for (let i = 0; i < howMany; i++) {
			const hexChar = this.popChar();
			if (hexDigitPattern.test(hexChar) === false) throw Error("Expecting a HexDecimal digits");
			hexString += hexChar;
		}
		return {
			type: "Character",
			value: parseInt(hexString, 16)
		};
	}
	peekChar(howMuch = 0) {
		return this.input[this.idx + howMuch];
	}
	popChar() {
		const nextChar = this.peekChar(0);
		this.consumeChar(void 0);
		return nextChar;
	}
	consumeChar(char) {
		if (char !== void 0 && this.input[this.idx] !== char) throw Error("Expected: '" + char + "' but found: '" + this.input[this.idx] + "' at offset: " + this.idx);
		if (this.idx >= this.input.length) throw Error("Unexpected end of input");
		this.idx++;
	}
	loc(begin) {
		return {
			begin,
			end: this.idx
		};
	}
};
//#endregion
//#region node_modules/@chevrotain/regexp-to-ast/lib/src/base-regexp-visitor.js
var BaseRegExpVisitor = class {
	visitChildren(node) {
		for (const key in node) {
			const child = node[key];
			/* istanbul ignore else */
			if (node.hasOwnProperty(key)) {
				if (child.type !== void 0) this.visit(child);
				else if (Array.isArray(child)) child.forEach((subChild) => {
					this.visit(subChild);
				}, this);
			}
		}
	}
	visit(node) {
		switch (node.type) {
			case "Pattern":
				this.visitPattern(node);
				break;
			case "Flags":
				this.visitFlags(node);
				break;
			case "Disjunction":
				this.visitDisjunction(node);
				break;
			case "Alternative":
				this.visitAlternative(node);
				break;
			case "StartAnchor":
				this.visitStartAnchor(node);
				break;
			case "EndAnchor":
				this.visitEndAnchor(node);
				break;
			case "WordBoundary":
				this.visitWordBoundary(node);
				break;
			case "NonWordBoundary":
				this.visitNonWordBoundary(node);
				break;
			case "Lookahead":
				this.visitLookahead(node);
				break;
			case "NegativeLookahead":
				this.visitNegativeLookahead(node);
				break;
			case "Lookbehind":
				this.visitLookbehind(node);
				break;
			case "NegativeLookbehind":
				this.visitNegativeLookbehind(node);
				break;
			case "Character":
				this.visitCharacter(node);
				break;
			case "Set":
				this.visitSet(node);
				break;
			case "Group":
				this.visitGroup(node);
				break;
			case "GroupBackReference":
				this.visitGroupBackReference(node);
				break;
			case "Quantifier": this.visitQuantifier(node);
		}
		this.visitChildren(node);
	}
	visitPattern(node) {}
	visitFlags(node) {}
	visitDisjunction(node) {}
	visitAlternative(node) {}
	visitStartAnchor(node) {}
	visitEndAnchor(node) {}
	visitWordBoundary(node) {}
	visitNonWordBoundary(node) {}
	visitLookahead(node) {}
	visitNegativeLookahead(node) {}
	visitLookbehind(node) {}
	visitNegativeLookbehind(node) {}
	visitCharacter(node) {}
	visitSet(node) {}
	visitGroup(node) {}
	visitGroupBackReference(node) {}
	visitQuantifier(node) {}
};
//#endregion
export { RegExpParser as n, BaseRegExpVisitor as t };
