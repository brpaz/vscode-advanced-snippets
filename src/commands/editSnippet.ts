import * as vscode from 'vscode';
import { Snippet } from '../domain/snippet';
import SnippetsTreeDataProvider from '../provider/treeViewProvider';
import SnippetsRepository from '../services/snippet.repository';

export default class EditSnippetCommand {
  constructor(
    private readonly snippetsRespository: SnippetsRepository,
    private readonly snippetsDataProvider: SnippetsTreeDataProvider,
  ) {}
  async execute(snippet: Snippet) {
    const document = await vscode.workspace.openTextDocument(snippet.getPath());

    vscode.window.showTextDocument(document, { preview: false });
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      if (document.uri.path === snippet.getPath()) {
        this.snippetsRespository.loadData();
        this.snippetsDataProvider.refresh();
      }
    });
  }
}
