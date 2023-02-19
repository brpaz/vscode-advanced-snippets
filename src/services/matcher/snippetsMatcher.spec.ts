import { MatcherService } from './snippetsMatcher';
import { SnippetsRepository } from '../../domain/repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { PackageFormat, Snippet } from '../../domain/snippet';
import { SnippetFolder } from '../../domain/folder';
import { TextDocument } from 'vscode';
import { IPackageProviderFactory, PackageProvider } from './packageProviders';

const mockSnippetsData: Snippet[] = [
  Snippet.create({
    id: '1',
    name: 'Snippet 1',
    body: 'Snippet 1 body',
    conditions: { language: 'javascript' },
    folder: new SnippetFolder('folderName', '/some/path'),
  }),
  Snippet.create({
    id: '2',
    name: 'Snippet 2',
    body: 'Snippet 2 body',
    conditions: { language: 'php' },
    folder: new SnippetFolder('folderName', '/some/path'),
  }),
  Snippet.create({
    id: '3',
    name: 'Dependabot config',
    body: 'body',
    conditions: { language: 'yaml', filePatterns: ['**/.github/dependabot.yml'] },
    folder: new SnippetFolder('folderName', '/some/path'),
  }),
  Snippet.create({
    id: '4',
    name: 'React script',
    body: 'body',
    conditions: { language: 'javascript', packages: [{ name: 'react', format: PackageFormat.NPM }] },
    folder: new SnippetFolder('folderName', '/some/path'),
  }),
];

describe('Snippets Matcher', () => {
  let snippetsMatcher: MatcherService;

  const packageProvider = mock<IPackageProviderFactory>();

  const provider = mock<PackageProvider>();

  beforeEach(() => {
    const snippetsRepository = mock<SnippetsRepository>();

    jest.spyOn(snippetsRepository, 'getAll').mockReturnValue(mockSnippetsData);
    snippetsMatcher = new MatcherService(snippetsRepository, packageProvider);

    jest.spyOn(packageProvider, 'getProvider').mockReturnValue(provider);
    jest.spyOn(provider, 'hasPackage').mockReturnValue(false);
  });

  it('should return snippets based on file language', () => {
    const document = {
      languageId: 'javascript',
      fileName: 'some-file.js',
    } as TextDocument;

    const snippets = snippetsMatcher.match(document, '/some/path');

    expect(snippets).toHaveLength(1);
    expect(snippets[0].getId()).toEqual('1');
  });

  it('should return snippets based language and file pattern', () => {
    const document = {
      languageId: 'yaml',
      fileName: '/my/path/.github/dependabot.yml',
    } as TextDocument;

    const snippets = snippetsMatcher.match(document, '/some/path');

    expect(snippets).toHaveLength(1);
    expect(snippets[0].getId()).toEqual('3');
  });

  it('should return snippets based on file pattern only if the language is correct', () => {
    const document = {
      languageId: 'csharp',
      fileName: '/my/path/.github/dependabot.yml',
    } as TextDocument;

    const snippets = snippetsMatcher.match(document, '/some/path');

    expect(snippets).toHaveLength(0);
  });

  it('should return snippets that matches a package', () => {
    const provider = mock<PackageProvider>();
    const document = {
      languageId: 'javascript',
      fileName: 'some-file.js',
    } as TextDocument;

    jest.spyOn(packageProvider, 'getProvider').mockReturnValue(provider);
    jest.spyOn(provider, 'hasPackage').mockReturnValue(true);

    const snippets = snippetsMatcher.match(document, '/some/path');

    expect(snippets).toHaveLength(2);
    expect(snippets[1].getId()).toEqual('4');
  });

  it('should not return snippets that do not match a package', () => {
    const document = {
      languageId: 'javascript',
      fileName: 'some-file.js',
    } as TextDocument;

    jest.spyOn(provider, 'hasPackage').mockReturnValue(false);

    const snippets = snippetsMatcher.match(document, '/some/path');

    expect(snippets).toHaveLength(1);
  });
});
