import * as vscode from 'vscode';
import SnippetsRepository from '../services/snippet.repository';
import { SnippetFolder } from '../domain/snippet';
import { SnippetTreeItem } from './treeItem';

export default class SnippetsTreeDataProvider implements vscode.TreeDataProvider<SnippetTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<SnippetTreeItem | undefined | null | void> =
    new vscode.EventEmitter<SnippetTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<SnippetTreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private snippetRepository: SnippetsRepository) {}

  getTreeItem(element: SnippetTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SnippetTreeItem): Thenable<SnippetTreeItem[]> {
    if (element) {
      return Promise.resolve(this.getSnippetsForFolder(element.label?.toString() ?? ''));
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
      return new SnippetTreeItem(folder);
    });
    return treeItems;
  }

  private getSnippetsForFolder(folderName: string): SnippetTreeItem[] {
    const snippets = this.snippetRepository.getAll();
    const snippetsForFolder = snippets.filter((snippet) => snippet.getFolder().getName() === folderName);

    const treeItems = snippetsForFolder.map((snippet) => {
      return new SnippetTreeItem(snippet);
    });

    return treeItems;
  }
}
