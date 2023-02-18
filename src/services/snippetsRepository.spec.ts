import * as fs from 'fs';
import { SnippetsStorage } from './snippetsStorage';
import { Snippet } from '../domain/snippet';
import SnippetsFileSystemRepository from './snippetsRepository';
import { mock, MockProxy } from 'jest-mock-extended';

jest.mock('fs');

describe('SnippetsFileSystemRepository', () => {
  const snippetsRoot = '/snippets-root';
  let snippetsLoader: MockProxy<SnippetsStorage>;
  let repository: SnippetsFileSystemRepository;

  beforeEach(() => {
    snippetsLoader = mock<SnippetsStorage>();
    repository = new SnippetsFileSystemRepository(snippetsRoot, snippetsLoader);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the snippets root', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    jest.spyOn(fs, 'mkdirSync');
    expect(fs.existsSync).toHaveBeenCalledWith(snippetsRoot);
    expect(fs.mkdirSync).toHaveBeenCalledWith(snippetsRoot);
  });

  /*it('should initialize the default folders', () => {
    expect(fs.mkdirSync).toHaveBeenCalledWith(`${snippetsRoot}/Default`);
  });

  it('should load data', () => {
    expect(snippetsLoader.load).toHaveBeenCalled();
    expect(repository.getFolders()).toEqual([folder]);
    expect(repository.getAll()).toEqual([snippet]);
  });

  it('should get a snippet by id', () => {
    expect(repository.getById(snippet.getId())).toEqual(snippet);
  });

  it('should get all snippets', () => {
    expect(repository.getAll()).toEqual([snippet]);
  });

  it('should get all folders', () => {
    expect(repository.getFolders()).toEqual([folder]);
  });

  it('should check if a folder exists', () => {
    expect(repository.hasFolder(folder.getName())).toBe(true);
  });*/
});
