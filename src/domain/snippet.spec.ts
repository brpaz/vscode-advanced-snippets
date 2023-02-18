import { SnippetFolder } from './folder';
import { Snippet } from './snippet';

describe('Snippet', () => {
  let snippet: Snippet;
  const props = {
    id: 'id',
    name: 'name',
    body: 'body',
    conditions: { language: 'javascript' },
    folder: new SnippetFolder('folderName', '/some/path'),
  };

  beforeEach(() => {
    snippet = Snippet.create(props);
  });

  it('should return the correct id', () => {
    expect(snippet.getId()).toEqual(props.id);
  });

  it('should return the correct name', () => {
    expect(snippet.getName()).toEqual(props.name);
  });

  it('should return the correct body', () => {
    expect(snippet.getBody()).toEqual(props.body);
  });

  it('should return the correct conditions', () => {
    expect(snippet.getConditions()).toEqual(props.conditions);
  });

  it('should return the correct folder', () => {
    expect(snippet.getFolder()).toEqual(props.folder);
  });

  it('should return the correct language', () => {
    expect(snippet.getLanguage()).toEqual(props.conditions.language);
  });

  it('should return the correct file name', () => {
    expect(snippet.getFileName()).toEqual(`${props.id}.snippet.yaml`);
  });

  it('should return the correct file path', () => {
    expect(snippet.getFilePath()).toEqual(`${props.folder.getPath()}/${snippet.getFileName()}`);
  });
});

describe('SnippetFolder', () => {
  const name = 'name';
  const path = 'path';
  const snippetFolder = new SnippetFolder(name, path);

  it('should return the correct name', () => {
    expect(snippetFolder.getName()).toEqual(name);
  });

  it('should return the correct path', () => {
    expect(snippetFolder.getPath()).toEqual(path);
  });
});
