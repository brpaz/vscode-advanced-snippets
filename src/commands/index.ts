import { ExtensionContext, commands } from 'vscode';
import { SnippetFolder } from '../domain/folder';
import { Snippet } from '../domain/snippet';
import { SnippetTreeItem } from '../provider/treeItem';
import SnippetsTreeDataProvider from '../provider/treeViewProvider';
import SnippetsFileSystemRepository from '../services/snippetsRepository';
import { MatcherService } from '../services/matcher/snippets.matcher';
import CreateFolderCommand from './createFolder';
import CreateSnippetCommand from './createSnippet';
import CreateSnippetFromSelectionCommand from './createSnippetFromSelection';
import DeleteFolderCommand from './deleteFolder';
import DeleteSnippetCommand from './deleteSnippet';
import EditSnippetCommand from './editSnippet';
import InsertSnippetCommand from './insertSnippet';
import SearchSnippetsCommand from './searchSnippets';
import MoveSnippetCommand from './moveSnippet';
import PackageProviderFactory from '../services/matcher/packageProviders/factory';

export enum Commands {
  CreateSnippet = `advanced-snippets.createSnippet`,
  CreateSnippetFromSelection = `advanced-snippets.createSnippetFromSelection`,
  InsertSnippet = `advanced-snippets.insertSnippet`,
  EditSnippet = `advanced-snippets.editSnippet`,
  SearchSnippets = `advanced-snippets.searchSnippets`,
  DeleteSnippet = `advanced-snippets.deleteSnippet`,
  MoveSnippet = `advanced-snippets.moveSnippet`,
  CreateFolder = `advanced-snippets.createFolder`,
  DeleteFolder = `advanced-snippets.deleteFolder`,
  RefreshTreeView = `advanced-snippets.refreshTreeView`,
}

export const registerCommands = (
  context: ExtensionContext,
  snippetsRepository: SnippetsFileSystemRepository,
  snippetsTreeDataProvider: SnippetsTreeDataProvider,
): void => {
  const createSnippetFromSelectionCommand = new CreateSnippetFromSelectionCommand(snippetsRepository);

  const insertSnippetCommand = new InsertSnippetCommand();

  const createFolderCommand = new CreateFolderCommand(snippetsRepository);
  const deleteFolderCommand = new DeleteFolderCommand(snippetsRepository);

  const deleteSnippetCommand = new DeleteSnippetCommand(snippetsRepository);

  const editSnippetCommand = new EditSnippetCommand(snippetsRepository);

  const packageProviderFactory = new PackageProviderFactory();
  const searchService = new MatcherService(snippetsRepository, packageProviderFactory);
  const searchSnippetsCommand = new SearchSnippetsCommand(searchService);

  const moveSnippetCommand = new MoveSnippetCommand(snippetsRepository);

  commands.registerCommand(Commands.RefreshTreeView, async () => {
    snippetsRepository.loadData();
    snippetsTreeDataProvider.refresh();
  });

  const createSnippetCommand = new CreateSnippetCommand(snippetsRepository);
  context.subscriptions.push(
    commands.registerCommand(Commands.CreateSnippet, async (item: SnippetTreeItem) => {
      const folder = item.element as SnippetFolder;
      return await createSnippetCommand.execute(folder);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand(Commands.CreateSnippetFromSelection, async () => {
      return await createSnippetFromSelectionCommand.execute();
    }),
  );

  context.subscriptions.push(
    commands.registerCommand(Commands.InsertSnippet, async (item: SnippetTreeItem) => {
      const snippet = item.element as Snippet;
      return await insertSnippetCommand.execute(snippet);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand(Commands.DeleteFolder, async (treeItem: SnippetTreeItem) => {
      return await deleteFolderCommand.execute(treeItem);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand(Commands.CreateFolder, async () => {
      return await createFolderCommand.execute();
    }),
  );

  context.subscriptions.push(
    commands.registerCommand(Commands.DeleteSnippet, async (treeItem: SnippetTreeItem) => {
      const snippet = treeItem.element as Snippet;
      return await deleteSnippetCommand.execute(snippet);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand(Commands.EditSnippet, async (treeItem: SnippetTreeItem) => {
      const snippet = treeItem.element as Snippet;
      return await editSnippetCommand.execute(snippet);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand(Commands.MoveSnippet, async (treeItem: SnippetTreeItem) => {
      const snippet = treeItem.element as Snippet;
      return await moveSnippetCommand.execute(snippet);
    }),
  );

  context.subscriptions.push(
    commands.registerCommand(Commands.SearchSnippets, async () => {
      return await searchSnippetsCommand.execute();
    }),
  );
};
