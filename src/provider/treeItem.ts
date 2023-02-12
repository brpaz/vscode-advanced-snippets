import * as vscode from 'vscode';
import { Commands } from '../commands/commands';

import { Snippet, SnippetFolder } from '../domain/snippet';

export class SnippetTreeItem extends vscode.TreeItem {
  constructor(readonly element: Snippet | SnippetFolder) {
    super(element.getName());

    this.contextValue = element instanceof SnippetFolder ? 'snippetFolder' : 'snippetFile';
    this.collapsibleState =
      element instanceof SnippetFolder
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None;

    if (element instanceof SnippetFolder) {
      this.command = {
        title: 'Delete Folder',
        command: Commands.DeleteFolder,
        arguments: [element],
      };
    }

    // TODO actions
    // edit snippet -> open yaml on editor.
    // delete snippet
    // folder -> create snippet.
  }
}
