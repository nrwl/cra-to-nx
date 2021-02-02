#!/usr/bin/env node
import { output } from '@nrwl/workspace/src/utilities/output';
import { execSync } from 'child_process';

import { statSync } from 'fs-extra';
import { addCRACommandsToWorkspaceJson } from './add-cra-commands-to-nx';
import { checkForUncommittedChanges } from './check-for-uncommitted-changes';
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

function addDependency(dep: string, dev?: boolean) {
  output.log({ title: `📦 Adding dependency: ${dep}` });
  if (isYarn()) {
    execSync(`yarn add ${dev ? '-D ' : ''}${dep}`);
  } else {
    execSync(`npm i ${dev ? '--save-dev ' : ''}${dep}`);
  }
}

export async function createNxWorkspaceForReact() {
  checkForUncommittedChanges();

  addDependency(`@nrwl/workspace`, true);
  output.log({ title: '🐳 Nx initialization' });

  const reactAppName = readNameFromPackageJson();
  execSync(
    `npx create-nx-workspace temp-workspace --appName=${reactAppName} --preset=react --style=css --nx-cloud`,
    { stdio: [0, 1, 2] }
  );

  execSync(`git restore .gitignore README.md package.json`);

  output.log({ title: '👋 Welcome to Nx!' });

  output.log({ title: '🧹 Clearing unused files' });
  execSync(
    `rm -rf temp-workspace/apps/${reactAppName}/* temp-workspace/apps/${reactAppName}/{.babelrc,.browserslistrc} node_modules`
  );

  output.log({ title: '🚚 Moving your React app in your new Nx workspace' });
  execSync(
    `mv ./{README.md,package.json,src,public} temp-workspace/apps/${reactAppName}`
  );
  process.chdir(`temp-workspace/`);

  output.log({ title: '🤹 Add CRA commands to workspace.json' });

  addCRACommandsToWorkspaceJson(reactAppName);

  output.log({ title: '🧑‍🔧 Customize webpack' });

  writeConfigOverrides(reactAppName);

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

  setupTsConfig(reactAppName);

  output.log({ title: '🙂 Please be patient, one final step remaining!' });

  output.log({
    title: '🧶 Adding npm packages to your new Nx workspace to support CRA',
  });

  addDependency('react-scripts', true);
  addDependency('@testing-library/jest-dom', true);
  addDependency('eslint-config-react-app', true);
  addDependency('react-app-rewired', true);
  addDependency('web-vitals', true);

  output.log({
    title: '🎉 Done!',
    bodyLines: [`You can now search about Nx.`],
  });
}
