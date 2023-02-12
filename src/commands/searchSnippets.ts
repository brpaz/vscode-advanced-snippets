import * as vscode from 'vscode';
import { Snippet } from '../domain/snippet';
import SnippetsRepository from '../services/snippet.repository';
import { ISearch } from '../services/snippet.search';

class SearchQuickPickItem implements vscode.QuickPickItem {
  snippet: Snippet;
  label: string;
  description: string;
  detail: string;

  constructor(snippet: Snippet, rootPath: string) {
    this.snippet = snippet;
    this.label = snippet.getName();
    this.detail = snippet.getFolder().getPath().replace(rootPath, '').replace(/\/$/, '');
    this.description = snippet.getLanguage();
  }
}

export default class SearchSnippetsCommand {
  constructor(private searchService: ISearch) {}

  async execute() {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
      vscode.window.showWarningMessage('No editor is active.');
      return;
    }

    const document = activeEditor.document;

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);

    const snippets = this.searchService.search(document);

    const pickItems = snippets.map((snippet) => new SearchQuickPickItem(snippet, ''));

    const selectedItem = await vscode.window.showQuickPick(pickItems, {
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: 'Search for a snippet',
    });

    if (!selectedItem) {
      return;
    }

    this.insertSnippet(activeEditor, selectedItem.snippet);
  }

  private insertSnippet(editor: vscode.TextEditor, snippet: Snippet) {
    const selection = editor.selection;

    const snippetContents = new vscode.SnippetString(snippet.getBody());

    editor.insertSnippet(snippetContents, selection.start);
  }
}
