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

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

export function setupTsConfig() {
  if (fileExists('apps/webapp/tsconfig.json')) {
    const json = require('apps/webapp/tsconfig.json');
    json.extends = '../../tsconfig.base.json';
    fs.writeFileSync(
      'apps/webapp/tsconfig.json',
      JSON.stringify(json, null, 2)
    );
  } else {
    fs.writeFileSync(
      'apps/webapp/tsconfig.json',
      JSON.stringify(defaultTsConfig, null, 2)
    );
  }

  if (fileExists('apps/webapp/tsconfig.app.json')) {
    const json = require('apps/webapp/tsconfig.app.json');
    json.extends = './tsconfig.json';
    fs.writeFileSync(
      'apps/webapp/tsconfig.app.json',
      JSON.stringify(json, null, 2)
    );
  } else {
    fs.writeFileSync(
      'apps/webapp/tsconfig.app.json',
      JSON.stringify(defaultTsConfigApp, null, 2)
    );
  }

  if (fileExists('apps/webapp/tsconfig.spec.json')) {
    const json = require('apps/webapp/tsconfig.spec.json');
    json.extends = './tsconfig.json';
    fs.writeFileSync(
      'apps/webapp/tsconfig.spec.json',
      JSON.stringify(json, null, 2)
    );
  } else {
    fs.writeFileSync(
      'apps/webapp/tsconfig.spec.json',
      JSON.stringify(defaultTsConfigSpec, null, 2)
    );
  }
}
