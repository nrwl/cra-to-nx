import { execSync } from 'child_process';

export function addCRACommandsToWorkspaceJson() {
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
}
