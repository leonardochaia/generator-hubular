'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const HubularDependencies = [
  'hubot',
  '@types/node',
  '@types/hubot',
  'reflect-metadata',
  // TODO
  'C:\\AstonishingLab\\Development\\hubular\\hubular-v0.0.1.tgz'
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
      Let's get you started your brand new Hubot Bot!`)
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

    // FIXME validate argument like we do when prompting
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
        return {
          botOwner: answers.botOwner || this.options.owner,
          botName: answers.botName || this.options.name,
          botDescription: answers.botDescription || this.options.description,
          botAdapter: answers.botAdapter || this.options.adapter
        };
      });
  }

  installHubularPackages() {
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

    this.fs.copy(this.templatePath('scripts/.gitkeep'), this.destinationPath('scripts/.gitkeep'));
    this.fs.copy(this.templatePath('external-scripts.json'), this.destinationPath('external-scripts.json'));

    this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));

    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
    this.fs.copy(this.templatePath('tsconfig.json'), this.destinationPath('tsconfig.json'));
    this.fs.copy(this.templatePath('tslint.json'), this.destinationPath('tslint.json'));

    this.fs.copyTpl(this.templatePath('bin/hubot'), this.destinationPath('bin/hubot'), this.answers);
    this.fs.copyTpl(this.templatePath('bin/hubot.cmd'), this.destinationPath('bin/hubot.cmd'), this.answers);

    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), this.answers);
  }

  end() {
    this.log(
      yosay(`Your ${chalk.red('Hubular')} app is ready!
      Use ${chalk.yellow('yarn start')} to run Hubot`)
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
