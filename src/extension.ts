import * as vscode from "vscode"
import { getWebviewContent } from "./webviewContentProvider"
import { createStory, updateStoryArgs } from "./commands"
import { checkUri, setPaths } from "./utils"
import { getComponentProps, getExistingStoryProps } from "./generator/getProps"
import { CREATE, FILE_INFO, MOUNT_CHECK, ON_ERROR, ON_INFO, OVERWRITE, UPDATE } from "./enums/messageTypes"

export function activate(context: vscode.ExtensionContext) {
	console.log("oberon vs extension is now active")
	let webviewViewInstance: vscode.WebviewView | undefined

	const setCurrentActiveFile = async (validUri: vscode.Uri) => {
		const { componentDir, storyDir, component, story } = setPaths(validUri)
		let storyProps
		const componentProps = await getComponentProps(componentDir)
		if (story) {
			storyProps = await getExistingStoryProps(storyDir)
		}

		webviewViewInstance?.webview.postMessage({
			type: FILE_INFO,
			value: {
				component: component,
				componentProps: componentProps || null,
				story: story,
				storyProps: storyProps || null,
			},
		})
	}

	const webView = vscode.window.registerWebviewViewProvider("sbgSideBarView", {
		resolveWebviewView: (webview: vscode.WebviewView) => {
			webviewViewInstance = webview
			webview.webview.options = {
				enableScripts: true,
			}
			webview.webview.html = getWebviewContent(context, webview.webview)
			webview.webview.onDidReceiveMessage(async (data) => {
				const validUri = checkUri()
				switch (data.type) {
					case ON_INFO:
						if (!data.value) return
						vscode.window.showInformationMessage(data.value)
						break
					case ON_ERROR:
						if (!data.value) return
						vscode.window.showErrorMessage(data.value)
						break
					// mount check should only run once
					case MOUNT_CHECK: {
						console.log("got initial mount from svelte")
						if (validUri) {
							setCurrentActiveFile(validUri)
						} else {
							webviewViewInstance?.webview.postMessage({
								type: FILE_INFO,
								value: {
									component: null,
									componentProps: null,
									story: null,
									storyProps: null,
								},
							})
						}
						break
					}
					case UPDATE: {
						if (validUri) {
							const { componentDir, storyDir, component, story } = setPaths(validUri)
							const result = await vscode.window.showWarningMessage(
								`This will update the story: ${story} with the latest component props and remove any unused ones are you sure?`,
								{ modal: true },
								"update"
							)

							if (result === "update") {
								updateStoryArgs().then(() => setCurrentActiveFile(validUri))
							}
						}
						break
					}
					case CREATE:
						if (validUri) {
							createStory().then(() => setCurrentActiveFile(validUri))
						}

						break
					case OVERWRITE: {
						if (validUri) {
							const { componentDir, storyDir, component, story } = setPaths(validUri)
							const result = await vscode.window.showWarningMessage(
								`Are you sure you want to completely overwrite the original story for: ${story}`,
								{ modal: true },
								"overwrite"
							)

							if (result === "overwrite") {
								createStory().then(() => setCurrentActiveFile(validUri))
							}
						}
						break
					}
					default:
						break
				}
			})
		},
	})

	const checkFile = vscode.window.onDidChangeActiveTextEditor((e) => {
		const validUri = checkUri()
		if (e?.document && validUri) {
			setCurrentActiveFile(validUri)
		} else if (!validUri) {
			webviewViewInstance?.webview.postMessage({
				type: FILE_INFO,
				value: {
					component: null,
					componentProps: null,
					story: null,
					storyProps: null,
				},
			})
		}
	})

	const fileDidSave = vscode.workspace.onDidSaveTextDocument((e) => {
		const validUri = checkUri()
		if (validUri && !e.isDirty) setCurrentActiveFile(validUri)
	})

	context.subscriptions.push(webView)
	context.subscriptions.push(checkFile)
	context.subscriptions.push(fileDidSave)
}

export function deactivate() {}
