// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EXTENSION_ID, CONFIG_KEY_TRIGGER_KEY, CONFIG_KEY_SNIPPETS_PATH, DEFAULT_TRIGGER_KEY } from './constants';
import SnippetsTreeDataProvider from './provider/treeViewProvider';
import SnippetsFileSystemRepository from './services/snippetsRepository';
import { FilesystemSnippetsStorage } from './services/snippetsStorage';
import { CompletionItemProvider } from './provider/completionProvider';
import { registerCommands } from './commands';
import { MatcherService } from './services/matcher/snippetsMatcher';
import PackageProviderFactory from './services/matcher/packageProviders/factory';
import { initializeStorage } from './utils/storage';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(`Init extension: ${EXTENSION_ID}`);

  const config = vscode.workspace.getConfiguration(EXTENSION_ID);
  const completionTriggerKey = config.get<string>(CONFIG_KEY_TRIGGER_KEY) || DEFAULT_TRIGGER_KEY;

  const snippetsPath = initializeStorage(config, context);

  const snippetsRepository = new SnippetsFileSystemRepository(
    snippetsPath,
    new FilesystemSnippetsStorage(snippetsPath),
  );

  const packageProviderFactory = new PackageProviderFactory();
  const snippetsMatcher = new MatcherService(snippetsRepository, packageProviderFactory);

  const snippetsTreeDataProvider = new SnippetsTreeDataProvider(snippetsRepository);
  snippetsRepository.addEventListener(snippetsTreeDataProvider);

  vscode.window.createTreeView('snippetsTreeView', {
    treeDataProvider: snippetsTreeDataProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      '*',
      new CompletionItemProvider(snippetsMatcher, vscode.workspace.getConfiguration()),
      completionTriggerKey,
    ),
  );

  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    // When a snippet file is updated refresh the tree view with the updated data.
    // This will also trigger a full reload of the snippets in memory.
    if (document.uri.path.includes(snippetsPath)) {
      snippetsRepository.updateByPath(document.uri.path);
    }
  });

  registerCommands(context, snippetsRepository, snippetsMatcher, snippetsTreeDataProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log(`Deactivate extension: ${EXTENSION_ID} `);
}
