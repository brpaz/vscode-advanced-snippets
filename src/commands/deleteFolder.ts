import { window } from 'vscode';
import { SnippetFolder } from '../domain/folder';
import { SnippetsRepository } from '../domain/repository';
import { SnippetTreeItem } from '../ui/snippetTreeItem';

/**
 * Command to delete a snippet folder
 */
export default class DeleteFolderCommand {
  constructor(private readonly snippetsRespository: SnippetsRepository) {}
  async execute(item: SnippetTreeItem) {
    const folder = item.element as SnippetFolder;

    const selection = await window.showInformationMessage(
      `Are you sure you want to delete the folder: ${folder.getName()}?`,
      'Yes',
      'No',
    );

    if (selection === 'Yes') {
      this.snippetsRespository.deleteFolder(folder);
      window.showInformationMessage(`Folder ${folder.getName()} was deleted successfully`);
    }
  }
}
