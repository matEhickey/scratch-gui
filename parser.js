/* eslint-disable no-console */

const fs = require('fs');
const _ = require('lodash');

// const random = () => Math.floor(Math.random() * 10000);

const log = (str) => {
    console.log(JSON.stringify(str, null, 2));
};

const getCharacters = (project) => {
    return project.targets.filter(t => !t.isStage);
};

const _getBlocksByCharacters = (project) => {
    return getCharacters(project).map(char => ({
        name: char.name,
        blocks: char.blocks
    }));
};

const flattenHash = (hashs) => {
    const finalHash = {};
    hashs.forEach((hash) => {
        Object.keys(hash).forEach((key) => {
            finalHash[key] = hash[key];
        });
    });
    return finalHash;
};

const getAllBlocks = (project) => {
    const scripts = project.targets;

    const blocks = scripts.map(scr => scr.blocks);
    // return characters.map(char => char.blocks);
    return flattenHash(blocks);
};

const relaceAllNames = (string, token, tokenValue) => {
    var index = 0;
    do {
        string = string.replace(token, tokenValue);
    } while ((index = string.indexOf(token, index + 1)) > -1);

    return string;
};

const convertBlockNames = (project) => {
    const blocks = getAllBlocks(project);
    const names = Object.keys(blocks);

    const translations = Object.entries(blocks).map((block, i) => {
        const trans = block[1].opcode + '_' + i;
        return ({
            name: names[i],
            new: trans
        });
    });

    const getTranslation = (name) => {
        return translations.find(translation => translation.name === name).new;
    };

    let str = JSON.stringify(project);
    names.forEach((name) => {
        str = relaceAllNames(str, name, getTranslation(name));
    });

    return JSON.parse(str);
};

const rawdata = fs.readFileSync('project.json');
let project = JSON.parse(rawdata);


// console.log(getCharacters(project));
// console.log(getBlocksByCharacters(project)[0].blocks);
project = convertBlockNames(project);
// console.log(getBlocksByCharacters(project)[0].blocks);
// log(project);
log(getAllBlocks(project));
