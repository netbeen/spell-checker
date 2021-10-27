const fs = require("fs");
const path = require("path");

const directoryOrFileBlackList = ['.git', '.idea'];

var Typo = require("typo-js");
var dictionary = new Typo('en_US');
var is_spelled_correctly = dictionary.check("mispelled");
var is_spelled_correctly = dictionary.check("apple appled");
var suggest = dictionary.suggest("auto");
console.log('is_spelled_correctly', is_spelled_correctly);
console.log('suggest', suggest);

const fullPathList = [];
const listFile = (dirFullName) => {
    const arr = fs.readdirSync(dirFullName);
    arr.forEach(function(subPath){
        if(directoryOrFileBlackList.find((blackListItem)=>(blackListItem.includes(subPath)))){
            return;
        }
        var fullPath = path.join(dirFullName,subPath);
        var stats = fs.statSync(fullPath);
        if(stats.isDirectory()){
            listFile(fullPath);
        }else{
            fullPathList.push(fullPath);
        }
    });
    return fullPathList;
}

const fileList = listFile("/Users/bytedance/modern.js");
console.log(fileList);
