import * as vscode from 'vscode';
import { Commands } from '.';
import { SnippetsRepository } from '../domain/repository';
import SnippetQuickPickItem from '../ui/snippetQuickPickItem';

export default class ViewSnippetCommand {
  constructor(private snippetsRepository: SnippetsRepository) {}

  async execute() {
    const snippets = this.snippetsRepository.getAll();

    if (snippets.length === 0) {
      vscode.window.showInformationMessage('No snippets found');
      return;
    }

    const pickItems = snippets.map((snippet) => new SnippetQuickPickItem(snippet));

    const selectedItem = await vscode.window.showQuickPick(pickItems, {
      ignoreFocusOut: true,
      placeHolder: 'Select snippet to view',
    });

    if (!selectedItem) {
      return;
    }

    vscode.commands.executeCommand(Commands.EditSnippet, selectedItem.snippet);
  }
}
