#!/usr/bin/env node

import fs from 'fs/promises';
import { Command, Option } from 'commander';

const init = async (projectName) => {
    console.log('📑  Copying files...');

    await fs.mkdir(`./${projectName}`);

    await fs.mkdir(`./${projectName}/public/`, { recursive: true });
    await fs.mkdir(`./${projectName}/src/assets/scss`, { recursive: true });
    await fs.mkdir(`./${projectName}/src/components`, { recursive: true });
    await fs.mkdir(`./${projectName}/src/router`, { recursive: true });
    await fs.mkdir(`./${projectName}/src/state`, { recursive: true });
    await fs.mkdir(`./${projectName}/src/views`, { recursive: true });

    await fs.copyFile('./template/vue/public/favicon.ico', `./${projectName}/public/favicon.ico`);
    await fs.copyFile('./template/vue/src/assets/scss/main.scss', `./${projectName}/src/assets/scss/main.scss`);

    await fs.copyFile('./template/vue/src/components/SimpleComponent.vue', `./${projectName}/src/components/SimpleComponent.vue`);
    await fs.copyFile('./template/vue/src/components/TheWelcome.vue', `./${projectName}/src/components/TheWelcome.vue`);
    await fs.copyFile('./template/vue/src/components/CustomComponent.vue', `./${projectName}/src/components/CustomComponent.vue`);

    await fs.copyFile('./template/vue/src/router/index.js', `./${projectName}/src/router/index.js`);
    await fs.copyFile('./template/vue/src/state/store.js', `./${projectName}/src/state/store.js`);

    await fs.copyFile('./template/vue/src/views/AboutView.vue', `./${projectName}/src/views/AboutView.vue`);
    await fs.copyFile('./template/vue/src/views/HomeView.vue', `./${projectName}/src/views/HomeView.vue`);

    await fs.copyFile('./template/vue/src/App.vue', `./${projectName}/src/App.vue`);
    await fs.copyFile('./template/vue/src/main.js', `./${projectName}/src/main.js`);

    await fs.copyFile('./template/vue/.gitignore', `./${projectName}/.gitignore`);
    await fs.copyFile('./template/vue/index.html', `./${projectName}/index.html`);
    await fs.copyFile('./template/vue/jsconfig.json', `./${projectName}/jsconfig.json`);
    await fs.copyFile('./template/vue/package.json', `./${projectName}/package.json`);
    await fs.copyFile('./template/vue/vite.config.js', `./${projectName}/vite.config.js`);
    await fs.copyFile('./template/vue/vitest.config.js', `./${projectName}/vitest.config.js`);

    const currentPackageJson = await fs.readFile(`./template/vue/package.json`, 'utf8');
    const newFileContent = currentPackageJson.replace(/custom-scaffolding/g, projectName);

    await fs.writeFile(`./${projectName}/package.json`, newFileContent, 'utf8');

    console.log('📑  Files copied...');
    console.log(`cd ${projectName}
    npm install
    npm run dev`);

};

const program = new Command();

program
    .addOption(new Option('-p, --project <name>', 'Create custom project with name'));

program.parse(process.argv);

const options = program.opts();
if (options.project) {
    init(options.name);
} else {
    init('obi-wan-kenobi');
}
