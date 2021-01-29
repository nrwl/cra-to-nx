#!/usr/bin/env node
import { output } from '@nrwl/workspace/src/utils/output';
import { execSync } from 'child_process';

import { statSync } from 'fs-extra';
// const inquirer = require('inquirer');
const sh = require('shelljs');

function directoryExists(filePath: string): boolean {
  try {
    return statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}

function fileExists(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

function isYarn() {
  console.log('Checking if yarn');
  try {
    statSync('yarn.lock');
    return true;
  } catch (e) {
    return false;
  }
}

function addDependency(dep: string) {
  // const stdio = parsedArgs.verbose ? [0, 1, 2] : ['ignore', 'ignore', 'ignore'];
  output.log({ title: `📦 Adding dependency: ${dep}` });
  if (isYarn()) {
    execSync(`yarn add -D ${dep}`);
  } else {
    execSync(`npm i --save-dev ${dep}`);
  }
}

export async function createNxWorkspaceForReact() {
  addDependency(`@nrwl/workspace`);
  const output = require('@nrwl/workspace/src/utils/output').output;
  output.log({ title: '🐳 Nx initialization' });
  execSync(
    `npx create-nx-workspace temp-workspace --appName=webapp --preset=react --style=css --nx-cloud`
  );

  execSync(`git restore .gitignore README.md package.json`);

  output.log({ title: '📃 Adding react scripts' });
  execSync(
    `${
      isYarn() ? 'yarn add --dev' : 'npm i --save-dev'
    } react-scripts @testing-library/jest-dom eslint-config-react-app react-app-rewired`
  );

  output.log({ title: 'Clearing unused files' });
  execSync(
    `rm -rf temp-workspace/apps/webapp/* temp-workspace/apps/webapp/{.babelrc,.browserslistrc} node_modules`
  );
  execSync(`git status`);

  output.log({ title: 'Moving react files' });
  execSync(
    `mv ./{README.md,package.json,src,public} temp-workspace/apps/webapp`
  );
  process.chdir(`temp-workspace/`);

  output.log({ title: 'Initializing nx scripts' });

  execSync(`nx g @nrwl/workspace:run-commands serve \
  --project webapp \
  --command "node ../../node_modules/.bin/react-app-rewired start" \
  --cwd "apps/webapp"`);

  execSync(`nx g @nrwl/workspace:run-commands build \
  --project webapp \
  --command "node ../../node_modules/.bin/react-app-rewired build" \
  --cwd "apps/webapp"`);

  execSync(`nx g @nrwl/workspace:run-commands lint \
  --project webapp \
  --command "node ../../node_modules/.bin/eslint src/**/*.tsx src/**/*.ts" \
  --cwd "apps/webapp"`);

  execSync(`nx g @nrwl/workspace:run-commands test \
  --project webapp \
  --command "node ../../node_modules/.bin/react-app-rewired test --watchAll=false" \
  --cwd "apps/webapp"`);

  sh.exec('git status --porcelain');

  // copySync(``) Copy the config-overrides here
  output.log({ title: 'Configuring environments' });

  execSync(`echo "SKIP_PREFLIGHT_CHECK=true" > .env`);
  execSync(`echo "node_modules" >> .gitignore`);

  output.log({ title: 'Final move' });

  process.chdir(`../`);

  execSync('mv temp-workspace/* ./');
  execSync(
    'mv temp-workspace/{.editorconfig,.env,.eslintrc.json,.gitignore,.prettierignore,.prettierrc,.vscode} ./'
  );
  execSync('rm -rf temp-workspace');

  output.log({ title: '🎉 Done!' });
}
