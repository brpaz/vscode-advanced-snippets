import { window } from 'vscode';
import { SnippetFolder } from '../domain/snippet';
import { SnippetTreeItem } from '../provider/treeItem';
import SnippetsTreeDataProvider from '../provider/treeViewProvider';
import SnippetsRepository from '../services/snippet.repository';

export default class DeleteFolderCommand {
  constructor(
    private readonly snippetsRespository: SnippetsRepository,
    private readonly snippetsDataProvider: SnippetsTreeDataProvider,
  ) {}
  async execute(item: SnippetTreeItem) {
    const folder = item.element as SnippetFolder;

    const selection = await window.showInformationMessage(
      `Are you sure you want to delete the folder: ${folder.getName()}?`,
      'Yes',
      'No',
    );

    if (selection === 'Yes') {
      this.snippetsRespository.deleteFolder(folder);
      this.snippetsDataProvider.refresh();

      window.showInformationMessage(`Folder ${folder.getName()} was deleted successfully`);
    }
  }
}
