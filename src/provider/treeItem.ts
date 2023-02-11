import * as vscode from 'vscode';
import * as path from 'path';
enum ItemType {
  Folder = 'folder',
  File = 'file',
}

export type TreeItem = SnippetTreeItem | FolderTreeItem;

export class SnippetTreeItem extends vscode.TreeItem {
  constructor(public readonly label: string, private type: ItemType, private resourcesPath: string) {
    const collapsibleState =
      type === ItemType.Folder ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;

    super(label, collapsibleState);
    this.contextValue = ItemType.Folder ? 'snippetFolder' : 'snippetFile';
    this.iconPath = {
      light: path.join(resourcesPath, 'icons', 'light', `${type}.svg`),
      dark: path.join(resourcesPath, 'icons', 'dark', `${type}.svg`),
    };

    /*if (type === ItemType.File) {
      this.command = {
        title: 'Insert Snippet',
        command: Commands.InsertSnippet,
        arguments: [this.label],
      };
    }*/
  }
}

export class FolderTreeItem extends vscode.TreeItem {
  constructor(public readonly label: string, private resourcesPath: string) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.contextValue = 'snippetFolder';
    this.iconPath = {
      light: path.join(resourcesPath, 'icons', 'light', 'folder.svg'),
      dark: path.join(resourcesPath, 'icons', 'dark', 'folder.svg'),
    };
  }
}
