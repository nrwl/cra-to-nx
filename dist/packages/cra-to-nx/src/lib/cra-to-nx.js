#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNxWorkspaceForReact = void 0;
const tslib_1 = require("tslib");
const output_1 = require("@nrwl/workspace/src/utils/output");
const child_process_1 = require("child_process");
const fs_extra_1 = require("fs-extra");
// const inquirer = require('inquirer');
const sh = require('shelljs');
function directoryExists(filePath) {
    try {
        return fs_extra_1.statSync(filePath).isDirectory();
    }
    catch (err) {
        return false;
    }
}
function fileExists(filePath) {
    try {
        return fs_extra_1.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}
function isYarn() {
    console.log('Checking if yarn');
    try {
        fs_extra_1.statSync('yarn.lock');
        return true;
    }
    catch (e) {
        return false;
    }
}
function addDependency(dep) {
    // const stdio = parsedArgs.verbose ? [0, 1, 2] : ['ignore', 'ignore', 'ignore'];
    output_1.output.log({ title: `📦 Adding dependency: ${dep}` });
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
        child_process_1.execSync(`nx g @nrwl/workspace:run-commands serve \
  --project webapp \
  --command "node ../../node_modules/.bin/react-app-rewired start" \
  --cwd "apps/webapp"`);
        child_process_1.execSync(`nx g @nrwl/workspace:run-commands build \
  --project webapp \
  --command "node ../../node_modules/.bin/react-app-rewired build" \
  --cwd "apps/webapp"`);
        child_process_1.execSync(`nx g @nrwl/workspace:run-commands lint \
  --project webapp \
  --command "node ../../node_modules/.bin/eslint src/**/*.tsx src/**/*.ts" \
  --cwd "apps/webapp"`);
        child_process_1.execSync(`nx g @nrwl/workspace:run-commands test \
  --project webapp \
  --command "node ../../node_modules/.bin/react-app-rewired test --watchAll=false" \
  --cwd "apps/webapp"`);
        // sh.exec('git status --porcelain');
        // copySync(``) Copy the config-overrides here
        /**
         * https://nx.dev/latest/react/migration/migration-cra#5-customize-webpack
         *
         * create file apps/webapp/config-overrides.js
         * with the contents
         *
         * Can I have it somewhere and just copy it?
         */
        output.log({ title: 'Configuring environments' });
        child_process_1.execSync(`echo "SKIP_PREFLIGHT_CHECK=true" > .env`);
        child_process_1.execSync(`echo "node_modules" >> .gitignore`);
        output.log({ title: 'Final move' });
        process.chdir(`../`);
        child_process_1.execSync('mv temp-workspace/* ./');
        child_process_1.execSync('mv temp-workspace/{.editorconfig,.env,.eslintrc.json,.gitignore,.prettierignore,.prettierrc,.vscode} ./');
        child_process_1.execSync('rm -rf temp-workspace');
        if (fileExists('apps/webapp/tsconfig.json')) {
            console.log('ts config exists, so update it');
        }
        else {
            sh.exec('touch apps/webapp/tsconfig.json');
            child_process_1.execSync(`echo "{" > apps/webapp/tsconfig.json`);
            child_process_1.execSync(`echo "'extends': '../../tsconfig.base.json'" > apps/webapp/tsconfig.json`);
            child_process_1.execSync(`echo "}" > apps/webapp/tsconfig.json`);
        }
        /**
         * If no tsconfig in app
         * 1. create tsconfig with:
         * {
        "extends": "../../tsconfig.base.json",
        ...
      }
         *
      
         If tsconfig in app
         just add
         {
            "extends": "../../tsconfig.base.json",
            ...
        }
         */
        output.log({ title: '🎉 Done!' });
    });
}
exports.createNxWorkspaceForReact = createNxWorkspaceForReact;
//# sourceMappingURL=cra-to-nx.js.map