import { QuickPickItem } from 'vscode';
import { Snippet } from '../domain/snippet';

export default class SnippetQuickPickItem implements QuickPickItem {
  snippet: Snippet;
  label: string;
  description: string;
  detail: string;

  constructor(snippet: Snippet) {
    this.snippet = snippet;
    this.label = snippet.getName();
    this.detail = snippet.getFolder().getName();
    this.description = snippet.getLanguage();
  }
}
