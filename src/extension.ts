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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(`Init extension: ${EXTENSION_ID}`);

  const snippetsPath = `${context.extensionPath}/snippets`;

  const snippetsRepository = new SnippetsRepository(snippetsPath, new FileSnippetsLoader(snippetsPath));

  const snippetsTreeDataProvider = new SnippetsTreeDataProvider(context.extensionPath, snippetsRepository);
  vscode.window.createTreeView('snippetsTreeView', {
    treeDataProvider: snippetsTreeDataProvider,
  });

  vscode.commands.registerCommand(Commands.RefreshTreeView, () => snippetsTreeDataProvider.refresh());

  const createSnippetCommand = new CreateSnippetCommand(snippetsRepository);
  context.subscriptions.push(vscode.commands.registerCommand(Commands.CreateSnippet, createSnippetCommand.execute));

  const createSnippetFromSelectionCommand = new CreateSnippetFromSelectionCommand(snippetsRepository);

  const insertSnippetCommand = new CreateSnippetFromSelectionCommand(snippetsRepository);

  const createFolderCommand = new CreateFolderCommand(snippetsRepository, snippetsTreeDataProvider);
  const deleteFolderCommand = new DeleteFolderCommand();

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.CreateSnippetFromSelection, async () => {
      return await createSnippetFromSelectionCommand.execute();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.InsertSnippet, async () => {
      return await insertSnippetCommand.execute();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.DeleteFolder, async (args: unknown) => {
      console.log(args);
      return await deleteFolderCommand.execute();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(Commands.CreateFolder, async () => {
      return await createFolderCommand.execute();
    }),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log(`Deactivate extension: ${EXTENSION_ID} `);
}
