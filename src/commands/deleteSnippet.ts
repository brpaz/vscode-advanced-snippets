import { window } from 'vscode';
import { Snippet } from '../domain/snippet';
import { SnippetTreeItem } from '../provider/treeItem';
import SnippetsTreeDataProvider from '../provider/treeViewProvider';
import SnippetsRepository from '../services/snippet.repository';

export default class DeleteSnippetCommand {
  constructor(
    private readonly snippetsRespository: SnippetsRepository,
    private readonly snippetsDataProvider: SnippetsTreeDataProvider,
  ) {}
  async execute(snippet: Snippet) {
    const selection = await window.showInformationMessage(
      `Are you sure you want to delete the snippet: ${snippet.getName()}?`,
      'Yes',
      'No',
    );

    if (selection === 'Yes') {
      this.snippetsRespository.delete(snippet);
      this.snippetsDataProvider.refresh();

      window.showInformationMessage(`Snippet ${snippet.getName()} was deleted successfully`);
    }
  }
}
