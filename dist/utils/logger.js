"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const smellsMap = {
    anyType: "ANY",
    enumImplicitValues: "EIV",
    missingUnionTypeAbstraction: "MUT",
    multipleBooleansForState: "MBS",
    nonNullAssertions: "NNA",
    overlyFlexibleProps: "OFP"
};
const logger = (analyzeOutput) => {
    const smellsOutput = [];
    analyzeOutput.forEach((output) => {
        const pathToFile = Object.keys(output)[0];
        const smells = output[pathToFile];
        const analysisData = Object.fromEntries(Object.entries(smells).map(([key, value]) => [
            smellsMap[key],
            (smellsMap[key] === "MUT" || smellsMap[key] === "MBS")
                ? (Array.isArray(value) && value.length > 0 ? 'Y' : 'N')
                : (Array.isArray(value) && value.length > 0 ? 1 : 0),
        ]));
        const outputEntry = {
            file: path_1.default.basename(pathToFile),
            ...analysisData
        };
        if (Object.values(analysisData).some(value => value === 1 || value === "Y")) {
            smellsOutput.push(outputEntry);
        }
    });
    return smellsOutput;
};
exports.logger = logger;
