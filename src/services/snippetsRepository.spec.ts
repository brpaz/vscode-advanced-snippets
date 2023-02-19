jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  rmSync: jest.fn(),
  rmdirSync: jest.fn(),
  renameSync: jest.fn(),
}));

import * as fs from 'fs';
import * as path from 'path';
import SnippetsFileSystemRepository from './snippetsRepository';
import { Snippet } from '../domain/snippet';
import { SnippetFolder } from '../domain/folder';
import { FilesystemSnippetsStorage } from './snippetsStorage';
import { mock, MockProxy } from 'jest-mock-extended';
import { SnippetEventListener } from '../domain/events';
const FIXTURES_PATH = path.join(__dirname, '..', '..', 'test', 'fixtures', 'snippets');

describe('SnippetsFileSystemRepository', () => {
  let storage: FilesystemSnippetsStorage;
  let repository: SnippetsFileSystemRepository;
  let eventListener: MockProxy<SnippetEventListener>;

  beforeEach(() => {
    storage = new FilesystemSnippetsStorage(FIXTURES_PATH);
    repository = new SnippetsFileSystemRepository(FIXTURES_PATH, storage);
    eventListener = mock<SnippetEventListener>();
    repository.addEventListener(eventListener);
    repository.loadData();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getById', () => {
    it('should return the snippet with the given id', () => {
      const snippet = repository.getById('c1ba5bee-f9e9-4a1d-aa20-76997f15f052');
      expect(snippet).toBeInstanceOf(Snippet);
      expect(snippet?.getId()).toBe('c1ba5bee-f9e9-4a1d-aa20-76997f15f052');
      expect(snippet?.getName()).toBe('React hello');
      expect(snippet?.getBody()).toContain('console.log("Hello world!")');
      expect(snippet?.getConditions().language).toBe('javascript');
      expect(snippet?.getFolder()?.getName()).toBe('folder2');
    });

    it('should return undefined if the snippet is not found', () => {
      const snippet = repository.getById('nonexistent');
      expect(snippet).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return all snippets', () => {
      const snippets = repository.getAll();
      expect(snippets).toHaveLength(2);
      expect(snippets[0].getName()).toBe('Hello world in Go');
      expect(snippets[0].getFolder()?.getName()).toBe('folder2');
      expect(snippets[1].getFolder()?.getName()).toBe('folder2');
      expect(snippets[1].getName()).toBe('React hello');
    });
  });

  describe('getFolders', () => {
    it('should return all folders', () => {
      const folders = repository.getFolders();
      expect(folders).toHaveLength(3);
      expect(folders[0]).toStrictEqual(new SnippetFolder('Default', path.join(FIXTURES_PATH, 'Default')));
      expect(folders[1]).toStrictEqual(new SnippetFolder('folder1', path.join(FIXTURES_PATH, 'folder1')));
      expect(folders[2]).toStrictEqual(new SnippetFolder('folder2', path.join(FIXTURES_PATH, 'folder2')));
    });
  });

  describe('hasFolder', () => {
    it('should return true if the repository has a folder with the given name', () => {
      expect(repository.hasFolder('folder1')).toBe(true);
    });

    it('should return false if the repository does not have a folder with the given name', () => {
      expect(repository.hasFolder('NonexistentFolder')).toBe(false);
    });
  });

  describe('getRootPath', () => {
    it('returns the configured snippet root path', () => {
      expect(repository.getRootPath()).toBe(FIXTURES_PATH);
    });
  });

  describe('createFolder', () => {
    it('should create a new folder', () => {
      repository.createFolder('folder3');
      expect(fs.mkdirSync).toHaveBeenCalledWith(path.join(FIXTURES_PATH, 'folder3'));
      expect(repository.hasFolder('folder3')).toBe(true);
      expect(eventListener.onFolderCreated).toHaveBeenCalledWith(
        new SnippetFolder('folder3', path.join(FIXTURES_PATH, 'folder3')),
      );
    });
  });

  describe('deleteFolder', () => {
    it('should delete an existing folder', () => {
      repository.deleteFolder(new SnippetFolder('folder1', path.join(FIXTURES_PATH, 'folder1')));
      expect(fs.rmSync).toHaveBeenCalledWith(path.join(FIXTURES_PATH, 'folder1'), expect.any(Object));
      expect(repository.hasFolder('folder1')).toBe(false);
      expect(eventListener.onFolderDeleted).toHaveBeenCalledWith(
        new SnippetFolder('folder1', path.join(FIXTURES_PATH, 'folder1')),
      );
    });
  });

  describe('save', () => {
    it('should save a snippet in a new folder', () => {
      const snippet = Snippet.create({
        id: 'new-snippet',
        folder: new SnippetFolder('folder4', path.join(FIXTURES_PATH, 'folder4')),
        name: 'New snippet',
        body: 'console.log("Hello world!")',
        conditions: { language: 'javascript' },
      });

      (fs.existsSync as jest.Mock) = jest.fn().mockReturnValue(false);
      repository.save(snippet);
      expect(fs.mkdirSync).toHaveBeenCalledWith(path.join(FIXTURES_PATH, 'folder4'));
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(FIXTURES_PATH, 'folder4', 'new-snippet.snippet.yaml'),
        expect.any(String),
      );
      expect(repository.hasFolder('folder4')).toBe(true);
      expect(repository.getById('new-snippet')).toBe(snippet);
      expect(eventListener.onSnippetCreated).toHaveBeenCalledWith(snippet);
    });

    it('should save a snippet in an existing folder', () => {
      const snippet = Snippet.create({
        id: 'new-snippet',
        folder: new SnippetFolder('folder1', path.join(FIXTURES_PATH, 'folder1')),
        name: 'New snippet',
        body: 'console.log("Hello world!")',
        conditions: { language: 'javascript' },
      });

      (fs.existsSync as jest.Mock) = jest.fn().mockReturnValue(true);
      repository.save(snippet);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(FIXTURES_PATH, 'folder1', 'new-snippet.snippet.yaml'),
        expect.any(String),
      );
      expect(repository.hasFolder('folder1')).toBe(true);
      expect(repository.getById('new-snippet')).toBe(snippet);
      expect(eventListener.onSnippetCreated).toHaveBeenCalledWith(snippet);
    });
  });

  describe('delete', () => {
    it('should delete a snippet', () => {
      const snippet = repository.getById('c1ba5bee-f9e9-4a1d-aa20-76997f15f052');

      if (!snippet) {
        throw new Error('Snippet not found');
      }

      repository.delete(snippet);
      expect(repository.getById('c1ba5bee-f9e9-4a1d-aa20-76997f15f052')).toBeUndefined();
      expect(fs.rmSync).toHaveBeenCalledWith(
        path.join(FIXTURES_PATH, 'folder2', 'c1ba5bee-f9e9-4a1d-aa20-76997f15f052.snippet.yaml'),
      );
      expect(eventListener.onSnippetDeleted).toHaveBeenCalledWith(snippet);
    });
  });

  describe('update', () => {
    it('should update a snippet', () => {
      const snippet = repository.getById('c1ba5bee-f9e9-4a1d-aa20-76997f15f052');

      if (!snippet) {
        throw new Error('Snippet not found');
      }

      snippet.setName('New name');
      repository.update(snippet);

      const updatedSnippet = repository.getById('c1ba5bee-f9e9-4a1d-aa20-76997f15f052');
      expect(updatedSnippet).toBe(snippet);
      expect(eventListener.onSnippetUpdated).toHaveBeenCalledWith(snippet);
    });
  });

  describe('move', () => {
    it('should move a snippet to a new folder', () => {
      const snippet = repository.getById('c1ba5bee-f9e9-4a1d-aa20-76997f15f052');

      if (!snippet) {
        throw new Error('Snippet not found');
      }

      const oldPath = snippet.getFilePath();
      const newFolder = new SnippetFolder('folder4', path.join(FIXTURES_PATH, 'folder4'));
      repository.move(snippet, newFolder);

      expect(fs.renameSync).toHaveBeenCalledWith(oldPath, `${newFolder.getPath()}/${snippet.getFileName()}`);

      const updatedSnippet = repository.getById('c1ba5bee-f9e9-4a1d-aa20-76997f15f052');
      expect(updatedSnippet?.getFolder()).toBe(newFolder);
      expect(eventListener.onSnippetUpdated).toHaveBeenCalledWith(snippet);
    });
  });
});
