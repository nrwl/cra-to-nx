"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readNameFromPackageJson = void 0;
const fileutils_1 = require("@nrwl/workspace/src/utilities/fileutils");
const fs = require('fs');
function readNameFromPackageJson() {
    let appName = 'webapp';
    if (fileutils_1.fileExists('package.json')) {
        const data = fs.readFileSync('package.json');
        const json = JSON.parse(data.toString());
        if (json['name'] &&
            json['name'].length &&
            json['name'].replace(/\s/g, '').length) {
            appName = json['name'].replace(/\s/g, '');
        }
    }
    return appName;
}
exports.readNameFromPackageJson = readNameFromPackageJson;
//# sourceMappingURL=read-name-from-package-json.js.map