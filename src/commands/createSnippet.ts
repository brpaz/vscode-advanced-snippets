import { window, workspace } from 'vscode';
import { SnippetFolder } from '../domain/folder';
import { SnippetsRepository } from '../domain/repository';
import { Snippet } from '../domain/snippet';
import { languages } from '../domain/languages';
export default class CreateSnippetCommand {
  constructor(private snippetsRepository: SnippetsRepository) {}
  async execute(folder: SnippetFolder) {
    const snippetName = await this.promptForName();
    if (!snippetName) {
      return;
    }

    const language = await this.promptForLanguage();

    if (!language) {
      return;
    }

    const snippet = Snippet.create({
      name: snippetName,
      folder: folder,
      body: 'replace this text with your snippet body',
      conditions: {
        language: language,
      },
    });

    this.snippetsRepository.save(snippet);

    const document = await workspace.openTextDocument(snippet.getFilePath());
    window.showTextDocument(document, { preview: false });
  }

  private async promptForLanguage(): Promise<string | undefined> {
    const activeEditor = window.activeTextEditor;
    const languageId = activeEditor?.document.languageId || undefined;

    return await window.showQuickPick(languages, {
      canPickMany: false,
      title: 'Select language',
      ignoreFocusOut: true,
      placeHolder: languageId,
    });
  }

  private async promptForName(): Promise<string | undefined> {
    return await window.showInputBox({
      prompt: 'Enter snippet name',
      ignoreFocusOut: true,
      validateInput: (text: string) => {
        if (text.length === 0) {
          return 'Snippet name cannot be empty';
        }

        return undefined;
      },
    });
  }
}
