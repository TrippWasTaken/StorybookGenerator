import * as vscode from "vscode"
import * as fs from "fs/promises"
import { checkUri, setPaths } from "./utils"
import { storyParser } from "./generator/storyParser"

import { generateBaseStory } from "./generator/generateStorybookFile"
import { getComponentProps } from "./generator/getProps"

export const updateStoryArgs = async () => {
	const componentUri = checkUri()
	if (componentUri) {
		const { componentDir, storyDir, component, story } = setPaths(componentUri)
		vscode.window.showInformationMessage(`updating story for ${component}`)

		try {
			const data = await fs.readFile(storyDir, "utf8")
			const propsIdexes = storyParser(data, true)
			const newComponentProps = await getComponentProps(componentDir)

			const newFile =
				data.substring(0, propsIdexes[0]) + JSON.stringify(newComponentProps) + data.substring(propsIdexes[1])

			fs.writeFile(storyDir, newFile, "utf8").then(() =>
				vscode.window.showInformationMessage(`updated props table for ${component} in ${story}`)
			)
		} catch (err) {
			vscode.window.showErrorMessage((err as Error).message)
		}
	} else {
		vscode.window.showErrorMessage("something went wrong, invalid component URI")
	}
}

export const createStory = async () => {
	vscode.window.showInformationMessage("generating default story")
	const componentUri = checkUri()
	if (componentUri) {
		const { component, componentDir, storyDir } = setPaths(componentUri)

		generateBaseStory(component, componentDir, storyDir)
	} else {
		vscode.window.showErrorMessage("active file must be .tsx")
	}
}
