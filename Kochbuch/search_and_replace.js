/**
 * Search and replace in files with node.js
 */
var fs = require('fs'),
    fileMatchPattern = '.html',
    fileReplacePattern = [
        {
            search: /<title>index<\/title>/g,
            replace: '<title>Ext JS Kochbuch: Start</title>'
        },
        {
            search: /<!-- This document was created with [^-]*-->/g,
            replace: ''
        }
],
    foundFiles = [],
    searchForFiles,
    replaceInFile,
    console = global.console;

searchForFiles = function (currentPath) {

    var files = fs.readdirSync(currentPath);

    for (var i in files) {
        var currentFile = currentPath + '/' + files[i];

        var stats = fs.statSync(currentFile);

        if (stats.isFile() && currentFile.indexOf(fileMatchPattern) >= 0) {
            //global.console.log(currentFile);
            foundFiles.push(currentFile);
        }
        else if (stats.isDirectory()) {
            searchForFiles(currentFile);
        }
    }
};

replaceInFile = function(filePath) {

    fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        fileReplacePattern.forEach(function (entry) {

            data = data.replace(entry.search, entry.replace);
        });

        fs.writeFile(filePath, data, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

// fills: foundFiles
searchForFiles('.', fileMatchPattern);

console.log(foundFiles);

foundFiles.forEach(replaceInFile);