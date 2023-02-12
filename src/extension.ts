// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EXTENSION_ID } from './constants';
import SnippetsTreeDataProvider from './provider/treeViewProvider';
import SnippetsRepository from './services/snippet.repository';
import { Commands } from './commands/commands';
import CreateSnippetCommand from './commands/createSnippet';
import CreateSnippetFromSelectionCommand from './commands/createSnippetFromSelection';
import { FileSnippetsLoader } from './services/snippets.loader';
import DeleteFolderCommand from './commands/deleteFolder';
import CreateFolderCommand from './commands/createFolder';
import { SnippetTreeItem } from './provider/treeItem';
import { CompletionItemProvider } from './provider/completionProvider';
import DeleteSnippetCommand from './commands/deleteSnippet';
import SearchSnippetsCommand from './commands/searchSnippets';
import InsertSnippetCommand from './commands/insertSnippet';
import { Snippet } from './domain/snippet';
import EditSnippetCommand from './commands/editSnippet';
import { SearchService } from './services/snippet.search';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(`Init extension: ${EXTENSION_ID}`);

  const snippetsPath = `${context.extensionPath}/snippets`;

  const snippetsRepository = new SnippetsRepository(snippetsPath, new FileSnippetsLoader(snippetsPath));

  const snippetsTreeDataProvider = new SnippetsTreeDataProvider(snippetsRepository);
  vscode.window.createTreeView('snippetsTreeView', {
    treeDataProvider: snippetsTreeDataProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('*', new CompletionItemProvider(snippetsRepository), '>'),
  );

  vscode.commands.registerCommand(Commands.RefreshTreeView, () => snippetsTreeDataProvider.refresh());

  const createSnippetCommand = new CreateSnippetCommand(snippetsRepository);
  context.subscriptions.push(vscode.commands.registerCommand(Commands.CreateSnippet, createSnippetCommand.execute));

  const createSnippetFromSelectionCommand = new CreateSnippetFromSelectionCommand(snippetsRepository);

  const insertSnippetCommand = new InsertSnippetCommand(snippetsRepository);

  const createFolderCommand = new CreateFolderCommand(snippetsRepository, snippetsTreeDataProvider);
  const deleteFolderCommand = new DeleteFolderCommand(snippetsRepository, snippetsTreeDataProvider);

  const deleteSnippetCommand = new DeleteSnippetCommand(snippetsRepository, snippetsTreeDataProvider);

  const editSnippetCommand = new EditSnippetCommand(snippetsRepository, snippetsTreeDataProvider);

  const searchService = new SearchService(snippetsRepository);

  const searchSnippetsCommand = new SearchSnippetsCommand(searchService);

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.CreateSnippetFromSelection, async () => {
      return await createSnippetFromSelectionCommand.execute();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.InsertSnippet, async (item: SnippetTreeItem) => {
      const snippet = item.element as Snippet;
      return await insertSnippetCommand.execute(snippet);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.DeleteFolder, async (treeItem: SnippetTreeItem) => {
      return await deleteFolderCommand.execute(treeItem);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.CreateFolder, async () => {
      return await createFolderCommand.execute();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.DeleteSnippet, async (treeItem: SnippetTreeItem) => {
      const snippet = treeItem.element as Snippet;
      return await deleteSnippetCommand.execute(snippet);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.EditSnippet, async (treeItem: SnippetTreeItem) => {
      const snippet = treeItem.element as Snippet;
      return await editSnippetCommand.execute(snippet);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.SearchSnippets, async () => {
      return await searchSnippetsCommand.execute();
    }),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log(`Deactivate extension: ${EXTENSION_ID} `);
}
