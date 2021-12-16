#!/usr/bin/env node
import yargsParser = require('yargs-parser');
import { createNxWorkspaceForReact } from './lib/cra-to-nx';
export * from './lib/cra-to-nx';

const parsedArgs = yargsParser(process.argv, {
  default: {
    craVersion: 5,
  },
});

createNxWorkspaceForReact(parsedArgs)
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
