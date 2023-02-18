import * as vscode from 'vscode';
import { SnippetsRepository } from '../domain/repository';
import { Snippet } from '../domain/snippet';
import { FolderQuickPickItem } from '../ui/folderQuickPick';

export default class MoveSnippetCommand {
  constructor(private readonly snippetsRespository: SnippetsRepository) {}
  async execute(snippet: Snippet) {
    const allFolders = this.snippetsRespository.getFolders();
    const folders = allFolders
      .filter((folder) => folder !== snippet.getFolder())
      .map((folder) => new FolderQuickPickItem(folder));

    const pickedFolder = await vscode.window.showQuickPick(folders, {
      placeHolder: 'Select folder',
    });

    if (!pickedFolder) {
      return;
    }

    const newFolder = (pickedFolder as FolderQuickPickItem).folder;

    this.snippetsRespository.move(snippet, newFolder);

    vscode.window.showInformationMessage(`Snippet moved to ${newFolder.getName()}`);
  }
}
