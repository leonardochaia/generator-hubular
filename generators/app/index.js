'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const npmName = require('npm-name');

const HubularDependencies = [
  'hubot',
  '@types/node',
  '@types/hubot',
  'reflect-metadata',
  'hubular'
];

const HubularDevDependencies = [
  'rimraf',
  'typescript'
];

module.exports = class extends Generator {

  initializing() {
    this.defaultName = 'hubot';
    this.defaultAdapter = 'shell';
    this.defaultDescription = 'A simple helpful robot for your Company';

    this._createOptions();
  }

  async prompting() {

    this.log(
      yosay(`Welcome to the ${chalk.red('Hubular')} generator!
      Let's get you started with your brand new Hubot Bot!`)
    );

    const prompts = [];

    if (!this.options.owner) {
      const botOwner = this._determineDefaultOwner();
      prompts.push({
        type: 'input',
        name: 'botOwner',
        message: 'Owner',
        default: botOwner
      });
    }

    if (!this.options.name) {
      prompts.push({
        type: 'input',
        name: 'botName',
        message: 'Bot name',
        default: this.defaultName
      });
    }

    if (!this.options.description) {
      prompts.push({
        type: 'input',
        name: 'botDescription',
        message: 'Description',
        default: this.defaultDescription
      });
    }

    if (!this.options.adapter) {
      prompts.push({
        type: 'input',
        name: 'botAdapter',
        message: 'Hubot adapter',
        default: this.defaultAdapter,
      })
    }

    this.answers = await this.prompt(prompts)
      .then(answers => {
        const results = {
          botOwner: answers.botOwner || this.options.owner,
          botName: answers.botName || this.options.name,
          botDescription: answers.botDescription || this.options.description,
          botAdapter: answers.botAdapter || this.options.adapter
        };

        this.log(`Validating adapter ${results.botAdapter}`);
        return npmName(`hubot-${results.botAdapter}`)
          .then(exists => {
            if (exists) {
              this.log(`Found adapter on NPM.`);
              return results;
            } else {
              this.env.error(`Package for adapter ${chalk.red(results.botAdapter)} does not exist on NPM.`);
            }
          }, (e) => {
            this.env.error(`Failed to find adapter ${chalk.red(results.botAdapter)} on NPM. \n ${e.message}`);
          });
      });
  }

  installHubularPackages() {

    // This shouldn't happen, but somehow it does.
    if (!this.answers.botAdapter || !this.answers.botAdapter.length) {
      this.log(`No adapter provided. Using ${this.defaultAdapter}`);
      this.answers.botAdapter = this.defaultAdapter;
    }

    const adapterPackage = [`hubot-${this.answers.botAdapter}`];

    const externalScripts = require('./templates/external-scripts.json');

    const deps = HubularDependencies
      .concat(adapterPackage)
      .concat(externalScripts);

    this.yarnInstall(deps, {
      'save': true
    });

    this.yarnInstall(HubularDevDependencies, {
      'dev': true
    });
  }

  writing() {
    this.log('Generating Contents..');

    this.fs.copy(this.templatePath('scripts/README.md'), this.destinationPath('scripts/README.md'));
    this.fs.copy(this.templatePath('external-scripts.json'), this.destinationPath('external-scripts.json'));

    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
    this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copy(this.templatePath('tslint.json'), this.destinationPath('tslint.json'));

    this.fs.copy(this.templatePath('_vscode'), this.destinationPath('.vscode'));

    this.fs.copyTpl(this.templatePath('_hubular.json'), this.destinationPath('hubular.json'), this.answers);

    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), this.answers);

    this.fs.copy(this.templatePath('README.md'), this.destinationPath('README.md'));
  }

  end() {
    let greet = `Your ${chalk.red('Hubular')} app is ready!`;

    if (this.answers.botAdapter !== this.defaultAdapter) {
      greet += `\nRemember to check the configuration for ${chalk.yellow(this.answers.botAdapter)} adapter!`
    }
    this.log(
      yosay(greet + `\nUse ${chalk.yellow('yarn start')} to run Hubot`)
    );
  }

  _determineDefaultOwner() {
    let userName
    let userEmail

    if (typeof (this.user.git.name) === 'function') {
      userName = this.user.git.name()
    } else {
      userName = this.user.git.name
    }

    if (typeof (this.user.git.email) === 'function') {
      userEmail = this.user.git.email()
    } else {
      userEmail = this.user.git.email
    }

    if (userName && userEmail) {
      return userName + ' <' + userEmail + '>'
    } else {
      return 'User <user@example.com>'
    }
  }

  _createOptions() {

    // FIXME add documentation to these
    this.option('owner', {
      desc: 'Name and email of the owner of new bot (ie Example <user@example.com>)',
      type: String
    })

    this.option('name', {
      desc: 'Name of new bot',
      type: String
    })

    this.option('description', {
      desc: 'Description of the new bot',
      type: String
    })

    this.option('adapter', {
      desc: 'Hubot adapter to use for new bot',
      type: String
    })

    this.option('defaults', {
      desc: 'Accept defaults and don\'t prompt for user input',
      type: Boolean
    })

    if (this.options.defaults) {
      this.options.owner = this.options.owner || this._determineDefaultOwner()
      this.options.name = this.options.name || this.defaultName;
      this.options.adapter = this.options.adapter || this.defaultAdapter
      this.options.description = this.options.description || this.defaultDescription
    }

    if (this.options.owner === true) {
      this.env.error('Missing owner. Make sure to specify it like --owner=' < owner > '')
    }

    if (this.options.name === true) {
      this.env.error('Missing name. Make sure to specify it like --name=' < name > '')
    }

    if (this.options.description === true) {
      this.env.error('Missing description. Make sure to specify it like --description=' < description > '')
    }

    if (this.options.adapter === true) {
      this.env.error('Missing adapter name. Make sure to specify it like --adapter=<adapter>')
    }
  }

};
