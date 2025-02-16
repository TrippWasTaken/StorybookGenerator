# Storybook generator

* For creating a basic story to have correct prop categorization in storybook controls.
* Props can be updated for existing files and compared.
* New stories can be created or old story files can be completely overwritten if someone wishes to start over on docs.
* The extension will alert of any prop mismatch as you edit a component or story.

![feature X](https://dev.azure.com/experlogix/422b3f3e-afa2-4cb2-8eff-23a306756683/_apis/git/repositories/b96aa610-73f8-44c0-b926-2d1dcbe08d3d/items?path=/VSCodeExtensions/StorybookGenerator/images/appscreenshot.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=main&resolveLfs=true&%24format=octetStream&api-version=5.0)

## Extension Settings

Right now there is no settings that can be customized

## Known Issues

* Sometimes it takes a little long to load or recognize a file (though this is mostly a dev env issue)
* some UI alignment is something a little strange.

# Development Guidelines

## What's in the folder

* This folder contains all of the files necessary for your extension.
* `package.json` - this is the manifest file in which you declare your extension and command.
  * The sample plugin registers a command and defines its title and command name. With this information VS Code can show the command in the command palette. It doesn’t yet need to load the plugin.
* `src/extension.ts` - this is the main file where you will provide the implementation of your command.
  * The fi…les matching the name pattern `**.test.ts`.
  * You can create folders inside the `test` folder to structure your tests any way you want.

## For any UI related additions.

* the webview uses Svelte 5.
* use the library https://vscode-elements.github.io/elements-lite/ located in this repo https://github.com/vscode-elements/elements-lite.
* simply copy the css and add it into the `vscode.css` file, should you need anymore css follow standard svelte styling via the `style` tag in your components.


# TDOD/IDEAS

* create an install script that will simply simlink the latest build from this folder and place a dummy folder for it in the vscode extentions so devs dont have to manually do it everytime.
* Automatic prettier formatting following projects `.prettierc` file.
* Flexible category sorting for the actual prop sorting.
* Improve UI - The two Prop Dropdowns so they overflow within the dropdown and now the whole webview.
* Add proper loading UI so a user knows the files are getting parsed.
* Improve the UI in general as now its a bit ugly