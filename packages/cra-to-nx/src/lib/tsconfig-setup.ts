const fs = require('fs');
const defaultTsConfig = {
  extends: '../../tsconfig.base.json',
};

const defaultTsConfigBase = {
  extends: './tsconfig.json',
};

const defaultTsConfigSpec = {
  extends: './tsconfig.json',
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

  if (fileExists('apps/webapp/tsconfig.base.json')) {
    const json = require('apps/webapp/tsconfig.base.json');
    json.extends = './tsconfig.json';
    fs.writeFileSync(
      'apps/webapp/tsconfig.base.json',
      JSON.stringify(json, null, 2)
    );
  } else {
    fs.writeFileSync(
      'apps/webapp/tsconfig.base.json',
      JSON.stringify(defaultTsConfigBase, null, 2)
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
