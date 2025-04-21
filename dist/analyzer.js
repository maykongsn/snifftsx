"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyze = exports.analyzeFile = void 0;
const file_reader_1 = require("./utils/file-reader");
const parser_1 = require("./utils/parser");
const any_type_1 = require("./smells/any-type");
const enum_implicit_values_1 = require("./smells/enum-implicit-values");
const missing_union_type_abstraction_1 = require("./smells/missing-union-type-abstraction");
const multiple_booleans_for_state_1 = require("./smells/multiple-booleans-for-state");
const non_null_assertions_1 = require("./smells/non-null-assertions");
const overly_flexible_props_1 = require("./smells/overly-flexible-props");
const analyzeFile = (file) => {
    const ast = (0, parser_1.parseAST)(file);
    const analyzers = {
        missingUnionTypeAbstraction: missing_union_type_abstraction_1.missingUnionTypeAbstraction,
        multipleBooleansForState: multiple_booleans_for_state_1.multipleBooleansForState,
        anyType: any_type_1.anyType,
        enumImplicitValues: enum_implicit_values_1.enumImplicitValues,
        nonNullAssertions: non_null_assertions_1.nonNullAssertions,
        overlyFlexibleProps: overly_flexible_props_1.overlyFlexibleProps
    };
    return {
        [file.path]: Object.fromEntries(Object.entries(analyzers).map(([key, analyzer]) => [key, analyzer(ast)]))
    };
};
exports.analyzeFile = analyzeFile;
const analyze = async (path) => {
    const analysis = [];
    for (const file of await (0, file_reader_1.readFiles)(path)) {
        analysis.push((0, exports.analyzeFile)(file));
    }
    return analysis;
};
exports.analyze = analyze;
