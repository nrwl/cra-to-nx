"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCRACommandsToWorkspaceJson = void 0;
const child_process_1 = require("child_process");
function addCRACommandsToWorkspaceJson() {
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
}
exports.addCRACommandsToWorkspaceJson = addCRACommandsToWorkspaceJson;
//# sourceMappingURL=add-cra-commands-to-nx.js.map