#!/usr/bin/env node
import { execSync } from 'child_process';

import { statSync } from 'fs-extra';
import { addCRACommandsToWorkspaceJson } from './add-cra-commands-to-nx';
import { readNameFromPackageJson } from './read-name-from-package-json';
import { setupTsConfig } from './tsconfig-setup';
import { writeConfigOverrides } from './write-config-overrides';

function isYarn() {
  try {
    statSync('yarn.lock');
    return true;
  } catch (e) {
    return false;
  }
}

function addDevDependency(dep: string) {
  const output = require('@nrwl/workspace/src/utils/output').output;
  output.log({ title: `📦 Adding dependency: ${dep}` });
  if (isYarn()) {
    execSync(`yarn add -D ${dep}`);
  } else {
    execSync(`npm i --save-dev ${dep}`);
  }
}

function addDependency(dep: string) {
  const output = require('@nrwl/workspace/src/utils/output').output;
  output.log({ title: `📦 Adding dependency: ${dep}` });
  if (isYarn()) {
    execSync(`yarn add ${dep}`);
  } else {
    execSync(`npm i ${dep}`);
  }
}

export async function createNxWorkspaceForReact() {
  addDevDependency(`@nrwl/workspace`);
  const output = require('@nrwl/workspace/src/utils/output').output;
  output.log({ title: '🐳 Nx initialization' });

  const reactAppName = readNameFromPackageJson();
  execSync(
    `npx create-nx-workspace temp-workspace --appName=${reactAppName} --preset=react --style=css --nx-cloud`
  );

  const P = ['\\', '|', '/', '-'];
  let x = 0;
  const loader = setInterval(() => {
    process.stdout.write(`\r${P[x++]}`);
    x %= P.length;
  }, 250);

  setTimeout(() => {
    clearInterval(loader);
  }, 5000);

  execSync(`git restore .gitignore README.md package.json`);

  output.log({ title: '👋 Welcome to Nx!' });

  output.log({ title: '🧹 Clearing unused files' });
  execSync(
    `rm -rf temp-workspace/apps/${reactAppName}/* temp-workspace/apps/${reactAppName}/{.babelrc,.browserslistrc} node_modules`
  );
  execSync(`git status`);

  output.log({ title: '🚚 Moving your React app in your new Nx workspace' });
  execSync(
    `mv ./{README.md,package.json,src,public} temp-workspace/apps/${reactAppName}`
  );
  process.chdir(`temp-workspace/`);

  output.log({ title: '🤹 Add CRA commands to workspace.json' });

  addCRACommandsToWorkspaceJson();

  output.log({ title: '🧑‍🔧 Customize webpack' });

  writeConfigOverrides();

  output.log({
    title: '🛬 Skip CRA preflight check since Nx manages the monorepo',
  });

  execSync(`echo "SKIP_PREFLIGHT_CHECK=true" > .env`);

  output.log({ title: '🧶 Add all node_modules to .gitignore' });

  execSync(`echo "node_modules" >> .gitignore`);

  output.log({ title: '🚚 Folder restructuring.' });

  process.chdir(`../`);

  execSync('mv temp-workspace/* ./');
  execSync(
    'mv temp-workspace/{.editorconfig,.env,.eslintrc.json,.gitignore,.prettierignore,.prettierrc,.vscode} ./'
  );
  execSync('rm -rf temp-workspace');

  output.log({ title: "📃 Extend the app's tsconfig.json from the base" });
  output.log({ title: '📃 Add tsconfig files for jest and eslint' });
  output.log({ title: '📃 Disable react/react-in-jsx-scope eslint rule' });

  setupTsConfig();

  output.log({ title: '🙂 Please be patient, one final step remaining!' });

  output.log({
    title: '🧶 Adding npm packages to your new Nx workspace to support CRA',
  });
  execSync(
    `${
      isYarn() ? 'yarn add --dev' : 'npm i --save-dev'
    } react-scripts @testing-library/jest-dom eslint-config-react-app react-app-rewired web-vitals`
  );

  addDependency('web-vitals');

  output.log({
    title: '🎉 Done!',
    bodyLines: [`You can now search about Nx.`],
  });
}
