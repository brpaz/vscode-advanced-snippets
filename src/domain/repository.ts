import { SnippetFolder } from './folder';
import { Snippet } from './snippet';

export interface SnippetsRepository {
  getAll(): Snippet[];
  getById(id: string): Snippet | undefined;
  save(snippet: Snippet): void;
  update(snippet: Snippet): void;
  updateByPath(filePath: string): void;
  move(snippet: Snippet, folder: SnippetFolder): void;
  delete(snippet: Snippet): void;
  getFolders(): SnippetFolder[];
  hasFolder(folderName: string): boolean;
  createFolder(folderName: string): void;
  deleteFolder(folderName: SnippetFolder): void;
}
