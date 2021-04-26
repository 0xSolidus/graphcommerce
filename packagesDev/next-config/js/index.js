"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withYarn1Workspaces = void 0;
const child_process_1 = require("child_process");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const next_transpile_modules_1 = __importDefault(require("next-transpile-modules"));
function withYarn1Workspaces(modules = []) {
    const packageStr = fs_1.readFileSync('package.json', 'utf-8');
    const packageJson = JSON.parse(packageStr);
    const hashSum = crypto_1.createHash('sha256').update(packageStr, 'utf-8').digest('hex').slice(0, 10);
    let infoJson;
    const cacheKey = `.next/cache/withYarn1Workspaces.${hashSum}.json`;
    try {
        infoJson = fs_1.readFileSync(cacheKey, 'utf-8');
    }
    catch (e) {
        infoJson = child_process_1.execSync('yarn workspaces info --json', { encoding: 'utf-8' });
        try {
            fs_1.writeFileSync(cacheKey, infoJson);
        }
        catch (er) {
            // do nothing
        }
    }
    const workspaceInfo = JSON.parse(JSON.parse(infoJson).data);
    const requestedPackages = [
        ...Object.keys(packageJson.dependencies ?? {}),
        ...Object.keys(packageJson.devDependencies ?? {}),
    ];
    const entries = Object.entries(workspaceInfo);
    const m = new Set(modules);
    entries.forEach(([p, b]) => {
        if (requestedPackages.includes(p)) {
            m.add(p);
            b.workspaceDependencies.forEach((wp) => m.add(wp));
        }
    });
    return next_transpile_modules_1.default([...m.values()], { resolveSymlinks: true });
}
exports.withYarn1Workspaces = withYarn1Workspaces;
