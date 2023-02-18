import { QuickPickItem } from 'vscode';
import { SnippetFolder } from '../domain/folder';

export class FolderQuickPickItem implements QuickPickItem {
  folder: SnippetFolder;
  label: string;
  isNew: boolean;

  constructor(folder: SnippetFolder) {
    this.folder = folder;
    this.label = folder.getName();
    this.isNew = false;
  }
}
