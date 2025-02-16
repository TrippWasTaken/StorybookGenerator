import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"

export const checkUri = () => {
  const componentUri = vscode.window.activeTextEditor?.document?.uri

  if (componentUri) {
    const dir = path.posix.basename(componentUri.fsPath)
    if (/\.(tsx)$/.test(dir)) {
      return componentUri
    }
  }
}

export const setPaths = (componentUri: vscode.Uri) => {
  const dir = path.posix.basename(componentUri.fsPath)
  let component
  let story = null

  const lastSlash = dir.lastIndexOf("\\")
  const fileExt = dir.lastIndexOf(".tsx")
  const storyExt = dir.lastIndexOf(".stories")
  if (storyExt !== -1) {
    story = dir.slice(lastSlash + 1, fileExt)
    component = dir.slice(lastSlash + 1, storyExt)
  } else {
    component = dir.slice(lastSlash + 1, fileExt)
  }
  const folderPath = dir.slice(0, lastSlash + 1)
  const storyDir = `${folderPath}${component}.stories.tsx`

  const componentDir = `${folderPath}${component}.tsx`

  if (!story && fs.existsSync(storyDir)) {
    story = `${component}.stories`
  }

  return { componentDir, storyDir, component, story }
}
