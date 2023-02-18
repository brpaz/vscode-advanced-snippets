import * as vscode from 'vscode';
import { Snippet } from '../domain/snippet';

export default class InsertSnippetCommand {
  execute(snippet: Snippet) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No editor is active.');
      return;
    }

    const selection = editor.selection;

    const snippetContents = new vscode.SnippetString(snippet.getBody());

    editor.insertSnippet(snippetContents, selection.start);
  }
}
