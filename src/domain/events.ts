import { SnippetFolder } from './folder';
import { Snippet } from './snippet';

export interface SnippetEventListener {
  onSnippetCreated(snippet: Snippet): void;
  onSnippetUpdated(snippet: Snippet): void;
  onSnippetDeleted(snippet: Snippet): void;
  onFolderCreated(folder: SnippetFolder): void;
  onFolderDeleted(folder: SnippetFolder): void;
}
