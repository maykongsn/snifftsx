"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendToCsv = void 0;
const csv_parse_1 = require("csv-parse");
const csv_stringify_1 = require("csv-stringify");
const fs_1 = __importDefault(require("fs"));
const appendToCsv = async (csvPath, analysisResult) => {
    const rows = [];
    await new Promise((resolve, reject) => {
        fs_1.default.createReadStream(csvPath)
            .pipe((0, csv_parse_1.parse)({ columns: true, trim: true }))
            .on("data", (row) => {
            delete row["Component"];
            rows.push(row);
        })
            .on("end", resolve)
            .on("error", reject);
    });
    let startId = rows.length + 1;
    const newRows = analysisResult.flatMap((result) => Object.entries(result).flatMap(([filePath, smells]) => {
        return Object.entries(smells).flatMap(([smellType, occurrences]) => occurrences.map((occurrence, _) => ({
            id: (startId++).toString(),
            file: filePath,
            Smell: smellType
                .replace(/([A-Z])/g, ' $1')
                .trim()
                .replace(/\b\w/g, (char) => char.toUpperCase()),
            Details: `Lines ${occurrence.start}-${occurrence.end}`,
            "Em uma escala de 1 a 5, como você avalia a relevância desse smell?": '',
            "Observação": '',
        })));
    }));
    rows.push(...newRows);
    await new Promise((resolve, reject) => {
        const writableStream = fs_1.default.createWriteStream(csvPath);
        const stringfier = (0, csv_stringify_1.stringify)({ header: true });
        stringfier.pipe(writableStream).on("finish", resolve).on("error", reject);
        rows.forEach((row) => stringfier.write(row));
        stringfier.end();
    });
};
exports.appendToCsv = appendToCsv;
