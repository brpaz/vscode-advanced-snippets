import { window } from 'vscode';
import { SnippetsRepository } from '../domain/repository';
import { Snippet } from '../domain/snippet';

export default class DeleteSnippetCommand {
  constructor(private readonly snippetsRespository: SnippetsRepository) {}
  async execute(snippet: Snippet) {
    const selection = await window.showInformationMessage(
      `Are you sure you want to delete the snippet: ${snippet.getName()}?`,
      'Yes',
      'No',
    );

    if (selection === 'Yes') {
      this.snippetsRespository.delete(snippet);
      window.showInformationMessage(`Snippet ${snippet.getName()} was deleted successfully`);
    }
  }
}
