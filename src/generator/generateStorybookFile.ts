import fs from "fs"
import * as vscode from "vscode"
import { getComponentProps } from "./getProps"

export const generateBaseStory = async (component: string, dir: string, storyWritePath: string) => {
	const argTypes = await getComponentProps(dir)
	const storyTemplate = `
  import type { StoryObj, Meta } from "@storybook/react"
  import ${component} from './${component}'
  
  // Default export for Storybook
  export default {
    title: 'components/${component}',
    component: ${component},
    tags: ["autodocs"],
    argTypes: ${JSON.stringify(argTypes)}
  } satisfies Meta<typeof ${component}>
  
  type Story = StoryObj<typeof ${component}>
  
  export const Default: Story = {
    render: ({ ...args }) => {
      return (
      <${component} {...args} />
      )
    }
  }
  `

	fs.writeFile(storyWritePath, storyTemplate, (err) => {
		if (err) {
			vscode.window.showErrorMessage(`something went wrong: ${err.message}`)
		} else {
			vscode.window.showInformationMessage(`story generated at ${storyWritePath}`)
		}
	})
}
