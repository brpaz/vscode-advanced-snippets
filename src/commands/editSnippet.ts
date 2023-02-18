import * as vscode from 'vscode';
import { SnippetsRepository } from '../domain/repository';
import { Snippet } from '../domain/snippet';

export default class EditSnippetCommand {
  constructor(private readonly snippetsRespository: SnippetsRepository) {}
  async execute(snippet: Snippet) {
    const document = await vscode.workspace.openTextDocument(snippet.getFilePath());
    vscode.window.showTextDocument(document, { preview: false });
  }
}
