import * as fs from "fs/promises"
import * as vscode from "vscode"
import { storyParser } from "./storyParser"
import { withDefaultConfig } from "react-docgen-typescript"
import type { ParentType } from "react-docgen-typescript/lib/parser"
import path from "path"

export const getExistingStoryProps = async (dir: string) => {
  try {
    const data = await fs.readFile(dir, "utf8")
    const finalProps = storyParser(data)
    return finalProps
  } catch (err) {
    vscode.window.showErrorMessage((err as Error).message)
  }
}

type ParentMapType = {
  [key: string]: string[]
}

export const getComponentProps = async (dir: string) => {

  // @todo verify ts config paths for all app types
  const getTsConf = () => {
    const stringDir = path.posix.basename(dir)
    const splitLocation = stringDir.lastIndexOf("src")
    const rootPath = stringDir.slice(0, splitLocation)
    console.log(rootPath, stringDir)

    const viteConfig = fs
      .stat(`${rootPath}tsconfig.app.json`)
      .then(() => `${rootPath}tsconfig.app.json`)
      .catch(() => false)

    const normalConfig = fs
      .stat(`${rootPath}tsconfig.json`)
      .then(() => `${rootPath}tsconfig.json`)
      .catch(() => false)

    return viteConfig || normalConfig
  }

  const parseResult = withDefaultConfig({
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => {
      console.log("from filter", prop)
      return true
    },
  }).parse(dir)

  const propKeys = Object.keys(parseResult[0].props)

  const parentMap: ParentMapType = {}
  const addKeyToMap = (parent: { fileName: string; name: string }, key: string) => {
    if (parent) {
      if (!parentMap.hasOwnProperty(parent.name)) {
        parentMap[parent.name] = []
      }

      parentMap[parent.name].push(key)
    }
  }

  console.log(parentMap)

  propKeys.forEach((propKey) => {
    const propItem = parseResult[0].props[propKey]

    const parent = propItem.parent
    const name = propItem.name

    addKeyToMap(parent as ParentType, name)
  })

  /*
  argTypes object map
  
  [propKey]: {
    table: {
      category: [propOrigin] eg "motion"
      subcategory: [propParent] eg "dragEvents"
    }
  }
  */

  const result: {
    [propKey: string]: {
      table: {
        category: string
      }
    }
  } = {}

  for (const [propOrigin, props] of Object.entries(parentMap)) {
    props.forEach((propKey: string) => {
      result[propKey] = {
        table: {
          category: propOrigin,
        },
      }
    })
  }
  return result
}
