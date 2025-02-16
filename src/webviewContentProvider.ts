import * as vscode from "vscode"

export function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview
): string {
  const styleResetUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "media", "reset.css")
  )
  const styleVSCodeUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "media", "vscode.css")
  )
  const styleMainUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "out", "bundle.css")
  )
  const getNonce = () => {
    let text = ""
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "out", "bundle.js")
  )

  const nonce = getNonce()

  return `<!DOCTYPE html>
			<html lang="en" style="height: 100%;">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">


				<title>storybook generator UI</title>
			</head>
			<body>
        <script nonce=${nonce}>
          const vscode = acquireVsCodeApi()
        </script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`
}
