import * as vscode from "vscode"

export const storyParser = (file: string, positionOnly = false) => {
  const startIndex = file.indexOf("argTypes:")
  if (startIndex === -1) {
    vscode.window.showErrorMessage("argTypes object not found.")
    return null
  }

  let braceIndex = file.indexOf("{", startIndex)
  if (braceIndex === -1) {
    vscode.window.showErrorMessage("Opening brace '{' not found.")
    return null
  }

  let openBraces = 1
  let endIndex = braceIndex + 1

  while (openBraces > 0 && endIndex < file.length) {
    if (file[endIndex] === "{") openBraces++
    if (file[endIndex] === "}") openBraces--

    endIndex++
  }

  const extractedText = file.slice(braceIndex, endIndex)
  if (!positionOnly) return new Function(`return ${extractedText}`)()
  return [braceIndex, endIndex]
}
