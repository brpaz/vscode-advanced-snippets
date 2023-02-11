import { QuickPickItem, window, QuickPickItemKind } from 'vscode';
import { Snippet, SnippetFolder } from '../domain/snippet';
import SnippetsRepository from '../services/snippet.repository';

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

export default class CreateSnippetFromSelectionCommand {
  constructor(private snippetsRepository: SnippetsRepository) {}
  async execute() {
    const editor = window.activeTextEditor;
    if (editor === undefined) {
      window.showErrorMessage('No active editor.');
      return;
    }

    const selection = editor.selection;

    if (selection.isEmpty) {
      window.showErrorMessage('No text selected');
      return;
    }

    const snippetName = await this.promptForName();

    if (snippetName === undefined) {
      return;
    }

    const selectedFolder = await this.promptForFolder();

    if (selectedFolder === undefined) {
      return;
    }

    const snippet = new Snippet(snippetName, editor.document.getText(selection), selectedFolder, {
      language: editor.document.languageId,
    });

    this.snippetsRepository.save(snippet);
  }

  private async promptForName(): Promise<string | undefined> {
    return await window.showInputBox({
      title: 'Create snippet',
      prompt: 'Enter snippet name',
      placeHolder: 'My awesome snippet',
      validateInput: (text: string) => {
        if (text.length === 0) {
          return 'Snippet name cannot be empty';
        }

        return undefined;
      },
    });
  }

  private async promptForFolder(): Promise<SnippetFolder | undefined> {
    const folders = this.snippetsRepository.getFolders().map((folder) => new FolderQuickPickItem(folder));
    const folderOptions = [
      {
        label: 'Create new folder',
        isNew: true,
      } as FolderQuickPickItem,
      {
        label: 'Select existing folder',
        kind: QuickPickItemKind.Separator,
      },
    ];

    const items = [...folderOptions, ...folders];

    const selected = (await window.showQuickPick(items, {
      title: 'Select a folder or create a new one',
    })) as FolderQuickPickItem;

    if (!selected) {
      return;
    }

    let selectedSnippetFolder;

    if (selected.isNew) {
      const folderName = await window.showInputBox({
        title: 'Create folder',
        prompt: 'Enter folder name',
        placeHolder: 'My awesome folder',

        validateInput: (text: string) => {
          if (text.length === 0) {
            return 'Folder name cannot be empty';
          }

          return undefined;
        },
      });

      if (folderName === undefined) {
        return;
      }

      selectedSnippetFolder = new SnippetFolder(folderName, '');
    } else {
      selectedSnippetFolder = selected.folder;
    }

    return selectedSnippetFolder;
  }
}
