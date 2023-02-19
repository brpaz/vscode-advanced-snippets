import * as vscode from 'vscode';
import { SnippetFolder } from '../domain/folder';
import { Snippet } from '../domain/snippet';

enum ContextValues {
  SnippetFolder = 'snippetFolder',
  SnippetFile = 'snippetFile',
}

/**
 * Tree item for snippet or snippet folder. It is used in SnippetTreeView.
 */
export class SnippetTreeItem extends vscode.TreeItem {
  constructor(readonly element: Snippet | SnippetFolder) {
    super(element.getName());

    this.contextValue = element instanceof SnippetFolder ? ContextValues.SnippetFolder : ContextValues.SnippetFile;
    this.tooltip = element instanceof Snippet ? element.getBody() : undefined;
    this.collapsibleState =
      element instanceof SnippetFolder
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.None;
  }
}
