"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCRACommandsToWorkspaceJson = void 0;
const child_process_1 = require("child_process");
function addCRACommandsToWorkspaceJson(appName) {
    child_process_1.execSync(`nx g @nrwl/workspace:run-commands serve \
    --project ${appName} \
    --command "node ../../node_modules/.bin/react-app-rewired start" \
    --cwd "apps/${appName}"`, { stdio: [0, 1, 2] });
    child_process_1.execSync(`nx g @nrwl/workspace:run-commands build \
    --project ${appName} \
    --command "node ../../node_modules/.bin/react-app-rewired build" \
    --cwd "apps/${appName}"`, { stdio: [0, 1, 2] });
    child_process_1.execSync(`nx g @nrwl/workspace:run-commands lint \
    --project ${appName} \
    --command "node ../../node_modules/.bin/eslint src/**/*.tsx src/**/*.ts" \
    --cwd "apps/${appName}"`, { stdio: [0, 1, 2] });
    child_process_1.execSync(`nx g @nrwl/workspace:run-commands test \
    --project ${appName} \
    --command "node ../../node_modules/.bin/react-app-rewired test --watchAll=false" \
    --cwd "apps/${appName}"`, { stdio: [0, 1, 2] });
}
exports.addCRACommandsToWorkspaceJson = addCRACommandsToWorkspaceJson;
//# sourceMappingURL=add-cra-commands-to-nx.js.map