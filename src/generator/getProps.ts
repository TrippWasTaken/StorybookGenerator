import * as fs from "fs/promises"
import * as vscode from "vscode"
import { storyParser } from "./storyParser"
import { withCustomConfig, withDefaultConfig } from "react-docgen-typescript"
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
	[key: string]: {
		[key: string]: string[]
	}
}

export const getComponentProps = async (dir: string) => {
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

	const tsPath = await getTsConf()
	const parseResult = withCustomConfig(tsPath as string, {
		shouldExtractLiteralValuesFromEnum: true,
		shouldRemoveUndefinedFromOptional: true,
		propFilter: (prop) => {
			console.log("from filter", prop)
			return true
		},
	}).parse(dir)

	const propKeys = Object.keys(parseResult[0].props)

	const parentMap: ParentMapType = {
		unisonReact: {},
		adobe: {},
		motion: {},
	}

	const regEx = {
		motion: /node_modules\/framer-motion/,
		adobe: /node_modules\/@react-types/,
		reactAria: /node_modules\/react-aria-components/,
	}

	const findParent = (path: string) => {
		if (regEx.motion.test(path)) return "motion"
		else if (regEx.adobe.test(path) || regEx.reactAria.test(path)) return "adobe"
		else return "unisonReact"
	}
	const addKeyToMap = (parent: { fileName: string; name: string }, key: string) => {
		const categorizedPath = findParent(parent.fileName)
		if (parent) {
			if (!Object.hasOwn(parentMap[categorizedPath], parent.name)) {
				parentMap[categorizedPath][parent.name] = []
			}

			parentMap[categorizedPath][parent.name].push(key)
		} else {
			console.error("no parent found for:", key, "skipping")
		}
	}

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
				subcategory: string
			}
		}
	} = {}

	for (const [propOrigin, subcategories] of Object.entries(parentMap)) {
		for (const [propParent, props] of Object.entries(subcategories)) {
			props.forEach((propKey: string) => {
				result[propKey] = {
					table: {
						category: propOrigin,
						subcategory: propParent,
					},
				}
			})
		}
	}

	return result
}
