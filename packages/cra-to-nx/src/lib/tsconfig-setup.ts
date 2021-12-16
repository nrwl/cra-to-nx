import { fileExists } from '@nrwl/workspace/src/utilities/fileutils';
import { output } from '@nrwl/workspace/src/utilities/output';

const fs = require('fs');

const defaultTsConfig = {
  extends: '../../tsconfig.base.json',
  compilerOptions: {
    jsx: 'react',
    allowJs: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
  },
  files: [],
  include: [],
  references: [
    {
      path: './tsconfig.app.json',
    },
    {
      path: './tsconfig.spec.json',
    },
  ],
};

const defaultTsConfigApp = {
  extends: './tsconfig.json',
  compilerOptions: {
    outDir: '../../dist/out-tsc',
    types: ['node'],
  },
  files: [
    '../../node_modules/@nrwl/react/typings/cssmodule.d.ts',
    '../../node_modules/@nrwl/react/typings/image.d.ts',
  ],
  exclude: ['**/*.spec.ts', '**/*.spec.tsx'],
  include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
};

const defaultTsConfigSpec = {
  extends: './tsconfig.json',
  compilerOptions: {
    outDir: '../../dist/out-tsc',
    module: 'commonjs',
    types: ['jest', 'node'],
  },
  include: [
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.spec.js',
    '**/*.spec.jsx',
    '**/*.d.ts',
  ],
  files: [
    '../../node_modules/@nrwl/react/typings/cssmodule.d.ts',
    '../../node_modules/@nrwl/react/typings/image.d.ts',
  ],
};

const defaultEsLintRc = {
  extends: ['plugin:@nrwl/nx/react', '../../.eslintrc.json'],
  ignorePatterns: ['!**/*'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};

export function setupTsConfig(appName: string) {
  if (fileExists(`apps/${appName}/tsconfig.json`)) {
    const data = fs.readFileSync(`apps/${appName}/tsconfig.json`);
    const json = JSON.parse(data.toString());
    json.extends = '../../tsconfig.base.json';
    if (json.compilerOptions) {
      json.compilerOptions.jsx = 'react';
    } else {
      json.compilerOptions = {
        jsx: 'react',
        allowJs: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      };
    }
    fs.writeFileSync(
      `apps/${appName}/tsconfig.json`,
      JSON.stringify(json, null, 2)
    );
  } else {
    fs.writeFileSync(
      `apps/${appName}/tsconfig.json`,
      JSON.stringify(defaultTsConfig, null, 2)
    );
  }

  if (fileExists(`apps/${appName}/tsconfig.app.json`)) {
    const data = fs.readFileSync(`apps/${appName}/tsconfig.app.json`);
    const json = JSON.parse(data.toString());
    json.extends = './tsconfig.json';
    fs.writeFileSync(
      `apps/${appName}/tsconfig.app.json`,
      JSON.stringify(json, null, 2)
    );
  } else {
    fs.writeFileSync(
      `apps/${appName}/tsconfig.app.json`,
      JSON.stringify(defaultTsConfigApp, null, 2)
    );
  }

  if (fileExists(`apps/${appName}/tsconfig.spec.json`)) {
    const data = fs.readFileSync(`apps/${appName}/tsconfig.spec.json`);
    const json = JSON.parse(data.toString());
    json.extends = './tsconfig.json';
    fs.writeFileSync(
      `apps/${appName}/tsconfig.spec.json`,
      JSON.stringify(json, null, 2)
    );
  } else {
    fs.writeFileSync(
      `apps/${appName}/tsconfig.spec.json`,
      JSON.stringify(defaultTsConfigSpec, null, 2)
    );
  }

  let eslintrc = defaultEsLintRc;
  const packageJson = JSON.parse(
    fs.readFileSync(`apps/${appName}/package.json`)
  );

  output.log({ title: 'package.json check' });
  // Use existing config if possible
  if (packageJson.eslintConfig) {
    output.log({ title: 'package.json exists' });
    eslintrc = packageJson.eslintConfig;
    eslintrc.ignorePatterns = ['!**/*'];
  } else {
    output.log({ title: 'package.json does not exists' });
  }

  fs.writeFileSync(
    `apps/${appName}/.eslintrc.json`,
    JSON.stringify(eslintrc, null, 2)
  );
}
