#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNxWorkspaceForReact = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
const add_cra_commands_to_nx_1 = require("./add-cra-commands-to-nx");
const read_name_from_package_json_1 = require("./read-name-from-package-json");
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
function addDevDependency(dep) {
    const output = require('@nrwl/workspace/src/utils/output').output;
    output.log({ title: `📦 Adding dependency: ${dep}` });
    if (isYarn()) {
        child_process_1.execSync(`yarn add -D ${dep}`);
    }
    else {
        child_process_1.execSync(`npm i --save-dev ${dep}`);
    }
}
function addDependency(dep) {
    const output = require('@nrwl/workspace/src/utils/output').output;
    output.log({ title: `📦 Adding dependency: ${dep}` });
    if (isYarn()) {
        child_process_1.execSync(`yarn add ${dep}`);
    }
    else {
        child_process_1.execSync(`npm i ${dep}`);
    }
}
function createNxWorkspaceForReact() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        addDevDependency(`@nrwl/workspace`);
        const output = require('@nrwl/workspace/src/utils/output').output;
        output.log({ title: '🐳 Nx initialization' });
        const reactAppName = read_name_from_package_json_1.readNameFromPackageJson();
        child_process_1.execSync(`npx create-nx-workspace temp-workspace --appName=${reactAppName} --preset=react --style=css --nx-cloud`);
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
        output.log({ title: '👋 Welcome to Nx!' });
        output.log({ title: '🧹 Clearing unused files' });
        child_process_1.execSync(`rm -rf temp-workspace/apps/${reactAppName}/* temp-workspace/apps/${reactAppName}/{.babelrc,.browserslistrc} node_modules`);
        child_process_1.execSync(`git status`);
        output.log({ title: '🚚 Moving your React app in your new Nx workspace' });
        child_process_1.execSync(`mv ./{README.md,package.json,src,public} temp-workspace/apps/${reactAppName}`);
        process.chdir(`temp-workspace/`);
        output.log({ title: '🤹 Add CRA commands to workspace.json' });
        add_cra_commands_to_nx_1.addCRACommandsToWorkspaceJson(reactAppName);
        output.log({ title: '🧑‍🔧 Customize webpack' });
        write_config_overrides_1.writeConfigOverrides(reactAppName);
        output.log({
            title: '🛬 Skip CRA preflight check since Nx manages the monorepo',
        });
        child_process_1.execSync(`echo "SKIP_PREFLIGHT_CHECK=true" > .env`);
        output.log({ title: '🧶 Add all node_modules to .gitignore' });
        child_process_1.execSync(`echo "node_modules" >> .gitignore`);
        output.log({ title: '🚚 Folder restructuring.' });
        process.chdir(`../`);
        child_process_1.execSync('mv temp-workspace/* ./');
        child_process_1.execSync('mv temp-workspace/{.editorconfig,.env,.eslintrc.json,.gitignore,.prettierignore,.prettierrc,.vscode} ./');
        child_process_1.execSync('rm -rf temp-workspace');
        output.log({ title: "📃 Extend the app's tsconfig.json from the base" });
        output.log({ title: '📃 Add tsconfig files for jest and eslint' });
        output.log({ title: '📃 Disable react/react-in-jsx-scope eslint rule' });
        tsconfig_setup_1.setupTsConfig(reactAppName);
        output.log({ title: '🙂 Please be patient, one final step remaining!' });
        output.log({
            title: '🧶 Adding npm packages to your new Nx workspace to support CRA',
        });
        addDevDependency('react-scripts');
        addDevDependency('@testing-library/jest-dom');
        addDevDependency('eslint-config-react-app');
        addDevDependency('react-app-rewired');
        addDevDependency('web-vitals');
        output.log({
            title: '🎉 Done!',
            bodyLines: [`You can now search about Nx.`],
        });
    });
}
exports.createNxWorkspaceForReact = createNxWorkspaceForReact;
//# sourceMappingURL=cra-to-nx.js.map