#!/usr/bin/env node

import fs from 'fs/promises';
import { fileURLToPath } from "node:url";
import path from "node:path";
import inquirer from 'inquirer';
import chalk from 'chalk';

const copyTemplateFilesAndFolders = async (source, destination, projectName) => {
    const filesAndFolders = await fs.readdir(source);

    for (const entry of filesAndFolders) {

        const currentSource = path.join(source, entry);
        const currentDestination = path.join(destination, entry);

        const stat = await fs.lstat(currentSource);

        if (stat.isDirectory()) {

            await fs.mkdir(currentDestination);
            await copyTemplateFilesAndFolders(currentSource, currentDestination);

        } else {

            // If the file is package.json we replace the default name with the one provided by the user
            if (/package.json/.test(currentSource)) {
                const currentPackageJson = await fs.readFile(currentSource, 'utf8');
                const newFileContent = currentPackageJson.replace(/custom-scaffolding/g, projectName);

                await fs.writeFile(currentDestination, newFileContent, 'utf8');
            } else {
                await fs.copyFile(currentSource, currentDestination);
            }

        }
    }
};

const init = async (projectName) => {

    const destination = path.join(process.cwd(), projectName);

    const source = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./template/vue"
    );

    try {
        console.log('📑  Copying files...');

        await fs.mkdir(destination);
        await copyTemplateFilesAndFolders(source, destination, projectName);

        console.log('📑  Files copied...');
        console.log(chalk.green(`\ncd ${projectName}\nnpm install\nnpm run dev`));
    } catch (error) {
        console.log(error);
    }
};

(async () => inquirer
    .prompt([
        {
            type: "input",
            name: "projectName",
            default: "obi-wan-kenobi"
        }
    ])
    .then((answers) => {
        init(answers.projectName);
    })
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            console.log(chalk.red("Cannot render the prompt..."));
        } else {
            console.log(chalk.red(error.message));
        }
    }))();