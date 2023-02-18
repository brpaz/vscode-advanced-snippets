// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EXTENSION_ID } from './constants';
import SnippetsTreeDataProvider from './provider/treeViewProvider';
import SnippetsFileSystemRepository from './services/snippetsRepository';
import { FilesystemSnippetsStorage } from './services/snippetsStorage';
import { CompletionItemProvider } from './provider/completionProvider';
import { registerCommands } from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(`Init extension: ${EXTENSION_ID}`);

  const snippetsPath = `${context.extensionPath}/snippets`;

  const snippetsRepository = new SnippetsFileSystemRepository(
    snippetsPath,
    new FilesystemSnippetsStorage(snippetsPath),
  );

  const snippetsTreeDataProvider = new SnippetsTreeDataProvider(snippetsRepository);
  snippetsRepository.addEventListener(snippetsTreeDataProvider);

  vscode.window.createTreeView('snippetsTreeView', {
    treeDataProvider: snippetsTreeDataProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('*', new CompletionItemProvider(snippetsRepository), '>'),
  );

  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    // When a snippet file is updated refresh the tree view with the updated data.
    // This will also trigger a full reload of the snippets in memory.
    if (document.uri.path.includes(snippetsPath)) {
      snippetsRepository.updateByPath(document.uri.path);
    }
  });

  registerCommands(context, snippetsRepository, snippetsTreeDataProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log(`Deactivate extension: ${EXTENSION_ID} `);
}
