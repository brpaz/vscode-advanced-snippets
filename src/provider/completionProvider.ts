import * as vscode from 'vscode';
import { Matcher } from '../services/matcher/snippetsMatcher';
import { CONFIG_KEY_TRIGGER_KEY } from '../constants';
export class CompletionItemProvider implements vscode.CompletionItemProvider {
  constructor(
    private readonly snippetsMatcher: Matcher,
    private readonly workspaceConfig: vscode.WorkspaceConfiguration,
  ) {}
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    console.log('Advanced Snippets: Triggred completion');
    const triggerCharacter = this.workspaceConfig.get<string>(CONFIG_KEY_TRIGGER_KEY);
    const line = document.lineAt(position.line).text;

    // If the character before the cursor is not the trigger character, return no results
    const charBefore = line[position.character - 1];
    if (charBefore !== triggerCharacter) {
      return [];
    }

    const rangeToRemove = new vscode.Range(position.line, position.character - 1, position.line, position.character);

    const snippets = this.snippetsMatcher.match(document, '');

    return snippets.map((snippet) => {
      const completionItem = new vscode.CompletionItem(snippet.getName());
      completionItem.additionalTextEdits = [vscode.TextEdit.delete(rangeToRemove)];
      completionItem.insertText = new vscode.SnippetString(snippet.getBody());
      completionItem.kind = vscode.CompletionItemKind.Snippet;
      return completionItem;
    });
  }
}
