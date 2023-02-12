import { window } from 'vscode';
import SnippetsTreeDataProvider from '../provider/treeViewProvider';
import SnippetsRepository from '../services/snippet.repository';
export default class CreateFolderCommand {
  constructor(
    private snippetsRepository: SnippetsRepository,
    private snippetsTreeDataProvider: SnippetsTreeDataProvider,
  ) {}

  async execute() {
    const folderName = await window.showInputBox({
      title: 'Create folder',
      prompt: 'Enter folder name',
      placeHolder: 'My awesome folder',
      validateInput: (text: string) => {
        if (text.length === 0) {
          return 'Folder name cannot be empty';
        }

        if (this.snippetsRepository.hasFolder(text)) {
          return `A folder named ${text} already exists`;
        }
        return undefined;
      },
    });

    if (folderName === undefined) {
      return;
    }

    this.snippetsRepository.createFolder(folderName);
    this.snippetsTreeDataProvider.refresh();

    window.showInformationMessage(`Folder ${folderName} was created successfully`);
  }
}
