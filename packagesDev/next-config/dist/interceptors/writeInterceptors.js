"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeInterceptors = writeInterceptors;
const promises_1 = __importDefault(require("node:fs/promises"));
const path_1 = __importDefault(require("path"));
// eslint-disable-next-line import/no-extraneous-dependencies
const glob_1 = require("glob");
const resolveDependenciesSync_1 = require("../utils/resolveDependenciesSync");
function checkFileExists(file) {
    return promises_1.default
        .access(file, promises_1.default.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}
async function writeInterceptors(interceptors, cwd = process.cwd()) {
    const dependencies = (0, resolveDependenciesSync_1.resolveDependenciesSync)(cwd);
    const existing = [];
    dependencies.forEach((dependency) => {
        const files = (0, glob_1.sync)([`${dependency}/**/*.interceptor.tsx`, `${dependency}/**/*.interceptor.ts`], { cwd });
        existing.push(...files);
    });
    const written = Object.entries(interceptors).map(async ([, plugin]) => {
        const extension = plugin.sourcePath.endsWith('.tsx') ? '.tsx' : '.ts';
        const relativeFile = `${plugin.fromRoot}.interceptor${extension}`;
        if (existing.includes(relativeFile)) {
            delete existing[existing.indexOf(relativeFile)];
        }
        if (existing.includes(`./${relativeFile}`)) {
            delete existing[existing.indexOf(`./${relativeFile}`)];
        }
        const fileToWrite = path_1.default.join(cwd, relativeFile);
        const isSame = (await checkFileExists(fileToWrite)) &&
            (await promises_1.default.readFile(fileToWrite, 'utf8')).toString() === plugin.template;
        if (!isSame)
            await promises_1.default.writeFile(fileToWrite, plugin.template);
    });
    // Cleanup unused interceptors
    const cleaned = existing.map(async (file) => (await checkFileExists(file)) && (await promises_1.default.unlink(file)));
    await Promise.all(written);
    await Promise.all(cleaned);
}
