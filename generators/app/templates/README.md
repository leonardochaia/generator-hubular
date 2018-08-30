# Welcome to Hubular

Welcome to your new Hubular App!

## Running Hubot

```bash
yarn start
```

## Typescript Watch

```bash
yarn start:watch
```

Will watch and compile your Typescript files.
You still need to reload Hubot scripts, using something like [`hubot-reload-scripts`](https://www.npmjs.com/package/hubot-reload-scripts)

## Debugging

Use `start:debug` to launch Node with the `--inspect` flag.
You can then attach using any Node debugger on port `9229`.

```bash
yarn start:debug
```

If you use Visual Studio Code, you can hit `F5` to attach the debugger.
Check the `.vscode/launch.json`