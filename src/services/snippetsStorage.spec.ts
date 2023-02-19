import * as path from 'path';
import * as fs from 'fs';
import { FilesystemSnippetsStorage } from './snippetsStorage';
import { SnippetFolder } from '../domain/folder';
import { PackageFormat, Snippet } from '../domain/snippet';

const SNIPPETS_ROOT = 'test/fixtures/snippets';

describe('Snippets Storage', () => {
  let loader: FilesystemSnippetsStorage;

  beforeEach(() => {
    loader = new FilesystemSnippetsStorage(SNIPPETS_ROOT);
  });

  describe('#load', () => {
    it('should load the folders and snippets from the file system', () => {
      const { folders, snippets } = loader.load();

      expect(folders.length).toBe(3);
      expect(snippets.length).toBe(2);
    });

    it('should return the correct information for each folder', () => {
      const { folders } = loader.load();

      expect(folders[0].getName()).toBe('Default');
      expect(folders[0].getPath()).toBe(path.join(SNIPPETS_ROOT, 'Default'));

      expect(folders[1].getName()).toBe('folder1');
      expect(folders[1].getPath()).toBe(path.join(SNIPPETS_ROOT, 'folder1'));

      expect(folders[2].getName()).toBe('folder2');
      expect(folders[2].getPath()).toBe(path.join(SNIPPETS_ROOT, 'folder2'));
    });

    it('should return the correct information for each snippet', () => {
      const { snippets } = loader.load();

      expect(snippets.length).toBe(2);

      const goSnippet = snippets[0];

      expect(goSnippet.getId()).toBe('2db136a1-71cc-4065-8994-351673224c41');
      expect(goSnippet.getName()).toBe('Hello world in Go');
      expect(goSnippet.getBody()).toBe('fmt.Println("Hello world!")\n');
      expect(goSnippet.getFilePath()).toBe(
        path.join(SNIPPETS_ROOT, 'folder2', '2db136a1-71cc-4065-8994-351673224c41.snippet.yaml'),
      );
      expect(goSnippet.getConditions().language).toBe('go');
      expect(goSnippet.getConditions().filePatterns).toHaveLength(0);
      expect(goSnippet.getConditions().packages).toBeUndefined();
      expect(goSnippet.getFolder()?.getName()).toBe('folder2');
      expect(goSnippet.getFolder()?.getPath()).toBe('test/fixtures/snippets/folder2');
    });
  });

  describe('#persist', () => {
    const mockWriteFileSync = jest.fn();
    beforeEach(() => {
      jest.mock('fs');
      (fs.writeFileSync as jest.Mock) = mockWriteFileSync;
    });

    afterEach(() => {
      jest.resetModules();
    });

    it('should persist the snippet to the file system', () => {
      const snippet = Snippet.create({
        name: 'Test snippet',
        body: 'hello',
        id: '59f64b5c-d937-4deb-9cd7-9f58f3f0c171',
        folder: new SnippetFolder('folder1', path.join(SNIPPETS_ROOT, 'folder1')),
        filePath: '/path/to/file',
        conditions: {
          language: 'javascript',
          filePatterns: ['**/*.js'],
          packages: [
            {
              name: 'react',
              format: PackageFormat.NPM,
            },
          ],
        },
      });

      const result = loader.persist(snippet);

      expect(mockWriteFileSync).toBeCalledWith(snippet.getFilePath(), expect.any(String));
      expect(result).toBe(snippet);
    });
  });
});
