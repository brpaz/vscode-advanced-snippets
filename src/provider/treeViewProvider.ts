import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import SnippetsRepository from '../services/snippet.repository';
import { SnippetFolder } from '../domain/snippet';
import { Commands } from '../commands/commands';

enum ItemType {
  Folder = 'folder',
  File = 'file',
}

export default class SnippetsTreeDataProvider implements vscode.TreeDataProvider<SnippetTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<SnippetTreeItem | undefined | null | void> =
    new vscode.EventEmitter<SnippetTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<SnippetTreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private extensionPath: string, private snippetRepository: SnippetsRepository) {}

  getTreeItem(element: SnippetTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SnippetTreeItem): Thenable<SnippetTreeItem[]> {
    if (element) {
      return Promise.resolve(this.getSnippetsForFolder(element.label));
    } else {
      return Promise.resolve(this.getRootFolders());
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  private getRootFolders(): SnippetTreeItem[] {
    const folders = this.snippetRepository.getFolders();
    const treeItems = folders.map((folder: SnippetFolder) => {
      return new SnippetTreeItem(folder.getName(), ItemType.Folder, this.extensionPath);
    });

    return treeItems;
  }

  private getSnippetsForFolder(folderName: string): SnippetTreeItem[] {
    const snippets = this.snippetRepository.getAll();
    const snippetsForFolder = snippets.filter((snippet) => snippet.getFolder().getName() === folderName);

    const treeItems = snippetsForFolder.map((snippet) => {
      return new SnippetTreeItem(snippet.getName(), ItemType.File, this.extensionPath);
    });

    return treeItems;
  }
}

class SnippetTreeItem extends vscode.TreeItem {
  constructor(public readonly label: string, private type: ItemType, private resourcesPath: string) {
    const collapsibleState =
      type === ItemType.Folder ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;

    super(label, collapsibleState);
    this.contextValue = ItemType.Folder ? 'snippetFolder' : 'snippetFile';

    this.iconPath = {
      light: path.join(resourcesPath, 'icons', 'light', `${type}.svg`),
      dark: path.join(resourcesPath, 'icons', 'dark', `${type}.svg`),
    };

    if (type === ItemType.File) {
      this.command = {
        title: 'Insert Snippet',
        command: Commands.InsertSnippet,
        arguments: [this.label],
      };
    }
  }
}
