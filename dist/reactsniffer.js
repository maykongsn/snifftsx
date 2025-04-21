"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runReactSniffer = void 0;
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const createObjectFromArray = (headers, values) => {
    return headers.reduce((accumulator, header, index) => ({
        ...accumulator,
        [header]: values[index]
    }), {});
};
const parseCell = (cell) => {
    const cleanCell = cell.replace(/'/g, "").trim();
    const parsedInt = parseInt(cleanCell, 10);
    return isNaN(parsedInt) ? cleanCell : parsedInt;
};
const parseLine = (line) => line.split('│').slice(2, -1).map(parseCell);
const parseTable = (table, headers) => {
    const lines = table.split('\n').filter((line) => line.includes('│'));
    return lines.slice(1).map(parseLine).map((cells) => createObjectFromArray(headers, cells));
};
const execPromise = (0, node_util_1.promisify)(node_child_process_1.exec);
const runReactSniffer = (pathToDir) => execPromise(`npx reactsniffer ${pathToDir}`)
    .then(({ stdout }) => {
    const tables = stdout.split('┌─────────┬');
    const table1String = '┌─────────┬' + tables[1].split('└─────────┴')[0] + '└─────────┴';
    const table2String = '┌─────────┬' + tables[2].split('└─────────┴')[0] + '└─────────┴';
    const table1Headers = ['id', 'Large File', 'LOC', 'N_Components', 'N_Functions', 'N_Imports'];
    const table2Headers = ['File', 'Component', 'LC', 'TP', 'IIC', 'FU', 'DOM', 'JSX', 'UC', 'PIS'];
    const table1 = parseTable(table1String, table1Headers);
    const table2 = parseTable(table2String, table2Headers);
    return {
        table1,
        table2
    };
})
    .catch(() => Promise.reject('No such file or directory.'));
exports.runReactSniffer = runReactSniffer;
