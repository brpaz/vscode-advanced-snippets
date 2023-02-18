import { window, QuickPickItemKind } from 'vscode';
import { SnippetFolder } from '../domain/folder';
import { Snippet } from '../domain/snippet';
import SnippetsFileSystemRepository from '../services/snippetsRepository';
import { FolderQuickPickItem } from '../ui/folderQuickPick';

export default class CreateSnippetFromSelectionCommand {
  constructor(private snippetsRepository: SnippetsFileSystemRepository) {}
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

    const snippet = Snippet.create({
      name: snippetName,
      body: editor.document.getText(selection),
      folder: selectedFolder,
      conditions: {
        language: editor.document.languageId,
      },
    });
    this.snippetsRepository.save(snippet);
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

      selectedSnippetFolder = new SnippetFolder(folderName, `${this.snippetsRepository.getRootPath()}/${folderName}`);
    } else {
      selectedSnippetFolder = selected.folder;
    }

    return selectedSnippetFolder;
  }
}
