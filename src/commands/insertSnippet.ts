import * as vscode from 'vscode';
import { Snippet } from '../domain/snippet';
import SnippetsRepository from '../services/snippet.repository';

export default class InsertSnippetCommand {
  constructor(private snippetsRepository: SnippetsRepository) {}
  execute(snippet: Snippet) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No editor is active.');
      return;
    }

    const selection = editor.selection;

    const snippetContents = new vscode.SnippetString(snippet.getBody());

    editor.insertSnippet(snippetContents, selection.start);
  }
}
