import * as vscode from 'vscode';
import SnippetsRepository from '../services/snippet.repository';

export class CompletionItemProvider implements vscode.CompletionItemProvider {
  constructor(private readonly snippetsRepository: SnippetsRepository) {}
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const line = document.lineAt(position.line).text;
    const charBefore = line[position.character - 1];
    if (charBefore !== '>') {
      return [];
    }

    const completionItem = new vscode.CompletionItem('MySnippet');
    completionItem.insertText = new vscode.SnippetString('Hello, World!');
    completionItem.kind = vscode.CompletionItemKind.Snippet;
    completionItem.commitCharacters = ['\n'];
    return [completionItem];
  }
}
