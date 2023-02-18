import * as vscode from 'vscode';
import SnippetsFileSystemRepository from '../services/snippetsRepository';
import { Snippet } from '../domain/snippet';
import { SnippetTreeItem } from './treeItem';
import { SnippetEventListener } from '../domain/events';
import { SnippetFolder } from '../domain/folder';

export default class SnippetsTreeDataProvider
  implements vscode.TreeDataProvider<SnippetTreeItem>, SnippetEventListener
{
  private _onDidChangeTreeData: vscode.EventEmitter<SnippetTreeItem | undefined | null | void> =
    new vscode.EventEmitter<SnippetTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<SnippetTreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private snippetRepository: SnippetsFileSystemRepository) {}

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
    const snippetsForFolder = snippets.filter((snippet) => snippet.getFolder()?.getName() === folderName);

    const treeItems = snippetsForFolder.map((snippet) => {
      return new SnippetTreeItem(snippet);
    });

    return treeItems;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSnippetCreated(snippet: Snippet): void {
    console.log(`snippet created event received: ${snippet.getName()}`);
    this.refresh();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSnippetUpdated(snippet: Snippet): void {
    console.log(`snippet updated event received: ${snippet.getName()}`);
    this.refresh();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSnippetDeleted(snippet: Snippet): void {
    console.log(`snippet created event received: ${snippet.getName()}`);
    this.refresh();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFolderCreated(folder: SnippetFolder): void {
    console.log(`folder created event received: ${folder.getName()}`);
    this.refresh();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFolderDeleted(folder: SnippetFolder): void {
    console.log(`folder deleted event received: ${folder.getName()}`);
    this.refresh();
  }
}
