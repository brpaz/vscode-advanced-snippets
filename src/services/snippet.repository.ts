import * as fs from 'fs';
import * as path from 'path';
import { SnippetsLoader } from './snippets.loader';
import { Snippet, SnippetFolder } from '../domain/snippet';

// TODO create interface
export default class SnippetsRepository {
  private readonly DEFAULT_FOLDER_NAME = 'Default';

  private snippets: Snippet[] = [];

  private folders: SnippetFolder[] = [];

  private snippetsRoot: string;

  private snippetsLoader: SnippetsLoader;

  constructor(snippetsRoot: string, loader: SnippetsLoader) {
    this.snippetsRoot = snippetsRoot;
    this.snippetsLoader = loader;

    this.ensureSnippetsRoot();
    this.ensureDefaultFolders();

    const { folders, snippets } = loader.load();

    this.folders = folders;
    this.snippets = snippets;
  }

  getById(id: string): Snippet | undefined {
    return this.snippets.find((snippet) => snippet.getId() === id);
  }

  getAll(): Snippet[] {
    return this.snippets;
  }

  getFolders(): SnippetFolder[] {
    return this.folders;
  }

  hasFolder(folderName: string): boolean {
    return this.folders.some((folder) => folder.getName() === folderName);
  }

  save(snippet: Snippet): void {
    const folderPath = path.join(this.snippetsRoot, snippet.getFolder().getName());
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    this.snippetsLoader.persist(snippet);
    this.snippets.push(snippet);
  }

  update(snippet: Snippet): void {
    console.log('update');
  }

  delete(snippet: Snippet): void {
    console.log('delete');
  }

  createFolder(folderName: string): SnippetFolder {
    const newFolderPath = `${this.snippetsRoot}/${folderName}`;
    fs.mkdirSync(newFolderPath);

    const newFolder = new SnippetFolder(folderName, newFolderPath);

    this.folders.push(newFolder);

    return newFolder;
  }

  private ensureSnippetsRoot(): void {
    if (!fs.existsSync(this.snippetsRoot)) {
      fs.mkdirSync(this.snippetsRoot);
    }
  }

  private ensureDefaultFolders(): void {
    const path = `${this.snippetsRoot}/${this.DEFAULT_FOLDER_NAME}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    this.folders.push(new SnippetFolder(this.DEFAULT_FOLDER_NAME, path));
  }
}
