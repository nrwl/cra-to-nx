#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNxWorkspaceForReact = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const add_cra_commands_to_nx_1 = require("./add-cra-commands-to-nx");
const tsconfig_setup_1 = require("./tsconfig-setup");
const write_config_overrides_1 = require("./write-config-overrides");
function isYarn() {
    try {
        fs_extra_1.statSync('yarn.lock');
        return true;
    }
    catch (e) {
        return false;
    }
}
function addDependency(dep) {
    const output = require('@nrwl/workspace/src/utils/output').output;
    output.log({ title: `📦 Adding dependency: ${dep}` });
    if (isYarn()) {
        child_process_1.execSync(`yarn add -D ${dep}`);
    }
    else {
        child_process_1.execSync(`npm i --save-dev ${dep}`);
    }
}
function createNxWorkspaceForReact() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        addDependency(`@nrwl/workspace`);
        const output = require('@nrwl/workspace/src/utils/output').output;
        output.log({ title: '🐳 Nx initialization' });
        child_process_1.execSync(`npx create-nx-workspace temp-workspace --appName=webapp --preset=react --style=css --nx-cloud`);
        const P = ['\\', '|', '/', '-'];
        let x = 0;
        const loader = setInterval(() => {
            process.stdout.write(`\r${P[x++]}`);
            x %= P.length;
        }, 250);
        setTimeout(() => {
            clearInterval(loader);
        }, 5000);
        child_process_1.execSync(`git restore .gitignore README.md package.json`);
        output.log({ title: '📃 Adding react scripts' });
        child_process_1.execSync(`${isYarn() ? 'yarn add --dev' : 'npm i --save-dev'} react-scripts @testing-library/jest-dom eslint-config-react-app react-app-rewired`);
        output.log({ title: 'Clearing unused files' });
        child_process_1.execSync(`rm -rf temp-workspace/apps/webapp/* temp-workspace/apps/webapp/{.babelrc,.browserslistrc} node_modules`);
        child_process_1.execSync(`git status`);
        output.log({ title: 'Moving react files' });
        child_process_1.execSync(`mv ./{README.md,package.json,src,public} temp-workspace/apps/webapp`);
        process.chdir(`temp-workspace/`);
        output.log({ title: 'Initializing nx scripts' });
        add_cra_commands_to_nx_1.addCRACommandsToWorkspaceJson();
        write_config_overrides_1.writeConfigOverrides();
        output.log({ title: 'Configuring environments' });
        child_process_1.execSync(`echo "SKIP_PREFLIGHT_CHECK=true" > .env`);
        child_process_1.execSync(`echo "node_modules" >> .gitignore`);
        output.log({ title: 'Final move' });
        process.chdir(`../`);
        child_process_1.execSync('mv temp-workspace/* ./');
        child_process_1.execSync('mv temp-workspace/{.editorconfig,.env,.eslintrc.json,.gitignore,.prettierignore,.prettierrc,.vscode} ./');
        child_process_1.execSync('rm -rf temp-workspace');
        output.log({ title: 'Setting up tsconfigs' });
        tsconfig_setup_1.setupTsConfig();
        output.log({ title: '🎉 Done!' });
    });
}
exports.createNxWorkspaceForReact = createNxWorkspaceForReact;
//# sourceMappingURL=cra-to-nx.js.map