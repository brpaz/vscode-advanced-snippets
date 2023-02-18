import * as vscode from 'vscode';
import { SnippetFolder } from '../domain/folder';

import { Snippet } from '../domain/snippet';

export class SnippetTreeItem extends vscode.TreeItem {
  constructor(readonly element: Snippet | SnippetFolder) {
    super(element.getName());

    this.contextValue = element instanceof SnippetFolder ? 'snippetFolder' : 'snippetFile';
    this.collapsibleState =
      element instanceof SnippetFolder
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None;
  }
}
