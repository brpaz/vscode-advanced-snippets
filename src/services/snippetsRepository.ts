import * as fs from 'fs';
import { SnippetsStorage } from './snippetsStorage';
import { Snippet } from '../domain/snippet';
import { SnippetFolder } from '../domain/folder';
import { SnippetsRepository } from '../domain/repository';
import { SnippetEventListener } from '../domain/events';

export default class SnippetsFileSystemRepository implements SnippetsRepository {
  private readonly DEFAULT_FOLDER_NAME = 'Default';

  private snippets: Snippet[] = [];

  private folders: SnippetFolder[] = [];

  private snippetsRoot: string;

  private storage: SnippetsStorage;

  private eventListeners: SnippetEventListener[] = [];

  constructor(snippetsRoot: string, storage: SnippetsStorage) {
    this.snippetsRoot = snippetsRoot;
    this.storage = storage;

    this.ensureSnippetsRoot();
    this.ensureDefaultFolders();

    this.loadData();
  }

  /**
   * When a snippet file changes it´s contents in the filesystem, we need to reload this object
   * into memory.
   *
   * In the case of the name of the snippet changing, we need to rename the file to reflect the new name.
   */
  updateByPath(filePath: string): void {
    const updatedSnippet = this.storage.loadFile(filePath);

    this.update(updatedSnippet);
  }

  addEventListener(listener: SnippetEventListener): void {
    this.eventListeners.push(listener);
  }

  getRootPath(): string {
    return this.snippetsRoot;
  }

  loadData(): void {
    const { folders, snippets } = this.storage.load();

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
    if (!fs.existsSync(snippet.getFolder().getPath())) {
      this.createFolder(snippet.getFolder().getName());
    }

    snippet = this.storage.persist(snippet);
    this.snippets.push(snippet);

    for (const listener of this.eventListeners) {
      listener.onSnippetCreated(snippet);
    }
  }

  update(snippet: Snippet): void {
    const index = this.snippets.findIndex((item) => item.getId() === snippet.getId());

    if (index === -1) {
      return;
    }
    this.snippets.splice(index, 1, snippet);

    for (const listener of this.eventListeners) {
      listener.onSnippetUpdated(snippet);
    }
  }

  delete(snippet: Snippet): void {
    const index = this.snippets.findIndex((item) => item.getId() === snippet.getId());

    if (index === -1) {
      return;
    }

    fs.rmSync(snippet.getFilePath());

    this.snippets.splice(index, 1);

    for (const listener of this.eventListeners) {
      listener.onSnippetDeleted(snippet);
    }
  }

  move(snippet: Snippet, folder: SnippetFolder): void {
    const oldPath = snippet.getFilePath();
    snippet.setFolder(folder);
    fs.renameSync(oldPath, snippet.getFilePath());

    const index = this.snippets.findIndex((item) => item.getId() === snippet.getId());

    if (index === -1) {
      return;
    }

    this.snippets.splice(index, 1, snippet);

    for (const listener of this.eventListeners) {
      listener.onSnippetUpdated(snippet);
    }
  }

  createFolder(folderName: string): SnippetFolder {
    const newFolderPath = `${this.snippetsRoot}/${folderName}`;
    fs.mkdirSync(newFolderPath);

    const newFolder = new SnippetFolder(folderName, newFolderPath);

    this.folders.push(newFolder);

    for (const listener of this.eventListeners) {
      listener.onFolderCreated(newFolder);
    }

    return newFolder;
  }

  /**
   * Delete a folder and all snippets inside it.
   * The snippets are removed in file system and in memory.
   * @param folder
   * @returns
   */
  deleteFolder(folder: SnippetFolder) {
    fs.rmdirSync(folder.getPath());

    const index = this.folders.findIndex((item) => item.getPath() === folder.getPath());

    if (index === -1) {
      return;
    }

    this.folders.splice(index, 1);

    for (const listener of this.eventListeners) {
      listener.onFolderDeleted(folder);
    }
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
