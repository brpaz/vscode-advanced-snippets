import * as vscode from 'vscode';
import { Snippet } from '../domain/snippet';
import { Matcher } from '../services/matcher/snippetsMatcher';
import SearchQuickPickItem from '../ui/snippetQuickPickItem';
export default class SearchSnippetsCommand {
  constructor(private searchService: Matcher) {}

  async execute() {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
      vscode.window.showWarningMessage('No editor is active.');
      return;
    }

    const document = activeEditor.document;

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);

    const snippets = this.searchService.match(document, workspaceFolder?.uri.fsPath || '');

    if (snippets.length === 0) {
      vscode.window.showInformationMessage('No snippets found');
      return;
    }

    const pickItems = snippets.map((snippet) => new SearchQuickPickItem(snippet));

    const selectedItem = await vscode.window.showQuickPick(pickItems, {
      ignoreFocusOut: true,
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
