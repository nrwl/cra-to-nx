#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cra_to_nx_1 = require("./lib/cra-to-nx");
tslib_1.__exportStar(require("./lib/cra-to-nx"), exports);
cra_to_nx_1.createNxWorkspaceForReact()
    .then(() => {
    process.exit(0);
})
    .catch((e) => {
    console.log(e);
    process.exit(1);
});
//# sourceMappingURL=index.js.map