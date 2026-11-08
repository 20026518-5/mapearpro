//#region node_modules/@chevrotain/gast/lib/src/model.js
function tokenLabel(tokType) {
	if (hasTokenLabel(tokType)) return tokType.LABEL;
	else return tokType.name;
}
function hasTokenLabel(obj) {
	return typeof obj.LABEL === "string" && obj.LABEL !== "";
}
var AbstractProduction = class {
	get definition() {
		return this._definition;
	}
	set definition(value) {
		this._definition = value;
	}
	constructor(_definition) {
		this._definition = _definition;
	}
	accept(visitor) {
		visitor.visit(this);
		this.definition.forEach((prod) => {
			prod.accept(visitor);
		});
	}
};
var NonTerminal = class extends AbstractProduction {
	constructor(options) {
		super([]);
		this.idx = 1;
		Object.assign(this, pickOnlyDefined(options));
	}
	set definition(definition) {}
	get definition() {
		if (this.referencedRule !== void 0) return this.referencedRule.definition;
		return [];
	}
	accept(visitor) {
		visitor.visit(this);
	}
};
var Rule = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.orgText = "";
		Object.assign(this, pickOnlyDefined(options));
	}
};
var Alternative = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.ignoreAmbiguities = false;
		Object.assign(this, pickOnlyDefined(options));
	}
};
var Option = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		Object.assign(this, pickOnlyDefined(options));
	}
};
var RepetitionMandatory = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		Object.assign(this, pickOnlyDefined(options));
	}
};
var RepetitionMandatoryWithSeparator = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		Object.assign(this, pickOnlyDefined(options));
	}
};
var Repetition = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		Object.assign(this, pickOnlyDefined(options));
	}
};
var RepetitionWithSeparator = class extends AbstractProduction {
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		Object.assign(this, pickOnlyDefined(options));
	}
};
var Alternation = class extends AbstractProduction {
	get definition() {
		return this._definition;
	}
	set definition(value) {
		this._definition = value;
	}
	constructor(options) {
		super(options.definition);
		this.idx = 1;
		this.ignoreAmbiguities = false;
		this.hasPredicates = false;
		Object.assign(this, pickOnlyDefined(options));
	}
};
var Terminal = class {
	constructor(options) {
		this.idx = 1;
		Object.assign(this, pickOnlyDefined(options));
	}
	accept(visitor) {
		visitor.visit(this);
	}
};
function serializeGrammar(topRules) {
	return topRules.map(serializeProduction);
}
function serializeProduction(node) {
	function convertDefinition(definition) {
		return definition.map(serializeProduction);
	}
	/* istanbul ignore else */
	if (node instanceof NonTerminal) {
		const serializedNonTerminal = {
			type: "NonTerminal",
			name: node.nonTerminalName,
			idx: node.idx
		};
		if (typeof node.label === "string") serializedNonTerminal.label = node.label;
		return serializedNonTerminal;
	} else if (node instanceof Alternative) return {
		type: "Alternative",
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof Option) return {
		type: "Option",
		idx: node.idx,
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof RepetitionMandatory) return {
		type: "RepetitionMandatory",
		idx: node.idx,
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof RepetitionMandatoryWithSeparator) return {
		type: "RepetitionMandatoryWithSeparator",
		idx: node.idx,
		separator: serializeProduction(new Terminal({ terminalType: node.separator })),
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof RepetitionWithSeparator) return {
		type: "RepetitionWithSeparator",
		idx: node.idx,
		separator: serializeProduction(new Terminal({ terminalType: node.separator })),
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof Repetition) return {
		type: "Repetition",
		idx: node.idx,
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof Alternation) return {
		type: "Alternation",
		idx: node.idx,
		definition: convertDefinition(node.definition)
	};
	else if (node instanceof Terminal) {
		const serializedTerminal = {
			type: "Terminal",
			name: node.terminalType.name,
			label: tokenLabel(node.terminalType),
			idx: node.idx
		};
		if (typeof node.label === "string") serializedTerminal.terminalLabel = node.label;
		const pattern = node.terminalType.PATTERN;
		if (node.terminalType.PATTERN) serializedTerminal.pattern = pattern instanceof RegExp ? pattern.source : pattern;
		return serializedTerminal;
	} else if (node instanceof Rule) return {
		type: "Rule",
		name: node.name,
		orgText: node.orgText,
		definition: convertDefinition(node.definition)
	};
	else throw Error("non exhaustive match");
}
function pickOnlyDefined(obj) {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== void 0));
}
//#endregion
//#region node_modules/@chevrotain/gast/lib/src/visitor.js
var GAstVisitor = class {
	visit(node) {
		const nodeAny = node;
		switch (nodeAny.constructor) {
			case NonTerminal: return this.visitNonTerminal(nodeAny);
			case Alternative: return this.visitAlternative(nodeAny);
			case Option: return this.visitOption(nodeAny);
			case RepetitionMandatory: return this.visitRepetitionMandatory(nodeAny);
			case RepetitionMandatoryWithSeparator: return this.visitRepetitionMandatoryWithSeparator(nodeAny);
			case RepetitionWithSeparator: return this.visitRepetitionWithSeparator(nodeAny);
			case Repetition: return this.visitRepetition(nodeAny);
			case Alternation: return this.visitAlternation(nodeAny);
			case Terminal: return this.visitTerminal(nodeAny);
			case Rule: return this.visitRule(nodeAny);
			/* c8 ignore next 2 */
			default: throw Error("non exhaustive match");
		}
	}
	/* c8 ignore next */
	visitNonTerminal(node) {}
	/* c8 ignore next */
	visitAlternative(node) {}
	/* c8 ignore next */
	visitOption(node) {}
	/* c8 ignore next */
	visitRepetition(node) {}
	/* c8 ignore next */
	visitRepetitionMandatory(node) {}
	/* c8 ignore next 3 */
	visitRepetitionMandatoryWithSeparator(node) {}
	/* c8 ignore next */
	visitRepetitionWithSeparator(node) {}
	/* c8 ignore next */
	visitAlternation(node) {}
	/* c8 ignore next */
	visitTerminal(node) {}
	/* c8 ignore next */
	visitRule(node) {}
};
//#endregion
//#region node_modules/@chevrotain/gast/lib/src/helpers.js
function isSequenceProd(prod) {
	return prod instanceof Alternative || prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionMandatory || prod instanceof RepetitionMandatoryWithSeparator || prod instanceof RepetitionWithSeparator || prod instanceof Terminal || prod instanceof Rule;
}
function isOptionalProd(prod, alreadyVisited = []) {
	if (prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionWithSeparator) return true;
	if (prod instanceof Alternation) return prod.definition.some((subProd) => {
		return isOptionalProd(subProd, alreadyVisited);
	});
	else if (prod instanceof NonTerminal && alreadyVisited.includes(prod)) return false;
	else if (prod instanceof AbstractProduction) {
		if (prod instanceof NonTerminal) alreadyVisited.push(prod);
		return prod.definition.every((subProd) => {
			return isOptionalProd(subProd, alreadyVisited);
		});
	} else return false;
}
function isBranchingProd(prod) {
	return prod instanceof Alternation;
}
function getProductionDslName(prod) {
	/* istanbul ignore else */
	if (prod instanceof NonTerminal) return "SUBRULE";
	else if (prod instanceof Option) return "OPTION";
	else if (prod instanceof Alternation) return "OR";
	else if (prod instanceof RepetitionMandatory) return "AT_LEAST_ONE";
	else if (prod instanceof RepetitionMandatoryWithSeparator) return "AT_LEAST_ONE_SEP";
	else if (prod instanceof RepetitionWithSeparator) return "MANY_SEP";
	else if (prod instanceof Repetition) return "MANY";
	else if (prod instanceof Terminal) return "CONSUME";
	else throw Error("non exhaustive match");
}
//#endregion
export { GAstVisitor as a, NonTerminal as c, RepetitionMandatory as d, RepetitionMandatoryWithSeparator as f, serializeGrammar as g, Terminal as h, isSequenceProd as i, Option as l, Rule as m, isBranchingProd as n, Alternation as o, RepetitionWithSeparator as p, isOptionalProd as r, Alternative as s, getProductionDslName as t, Repetition as u };
