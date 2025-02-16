# Storybook generator

* For creating a basic story to have correct prop categorization in storybook controls.
* Props can be updated for existing files and compared.
* New stories can be created or old story files can be completely overwritten if someone wishes to start over on docs.
* The extension will alert of any prop mismatch as you edit a component or story.

## Extension Settings

Right now there is no settings that can be customized

## Known Issues

* Sometimes it takes a little long to load or recognize a file and theres no loading indicator right now
* some UI alignment is something a little strange.

# Development Guidelines

## What's in the folder

* This folder contains all of the files necessary for your extension.
* `package.json` - this is the manifest file in which you declare your extension and command.
  * The sample plugin registers a command and defines its title and command name. With this information VS Code can show the command in the command palette. It doesn’t yet need to load the plugin.
* `src/extension.ts` - this is the main file where you will provide the implementation of your command.
  * The files matching the name pattern `**.test.ts`.
  * You can create folders inside the `test` folder to structure your tests any way you want.

## For any UI related additions.

* the webview uses Svelte 5.
* use the library https://vscode-elements.github.io/elements-lite/ located in this repo https://github.com/vscode-elements/elements-lite.
* simply copy the css and add it into the `vscode.css` file, should you need anymore css follow standard svelte styling via the `style` tag in your components.


# TDOD/IDEAS

* Automatic prettier formatting following projects `.prettierc` file.
* Flexible category sorting for the actual prop sorting.
* Improve UI - The two Prop Dropdowns so they overflow within the dropdown and now the whole webview.
* Add proper loading UI so a user knows the files are getting parsed.
* Improve the UI in general as now its a bit ugly