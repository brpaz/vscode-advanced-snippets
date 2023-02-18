/*import { window } from 'vscode';
import { SnippetsRepository } from '../domain/repository';
import DeleteSnippetCommand from './deleteSnippet';

import { mock, MockProxy } from 'jest-mock-extended';
import { Snippet, SnippetFolder, SnippetProps } from '../domain/snippet';*/

/*describe('deleteSnippet', () => {
  let deleteSnippetCommand: DeleteSnippetCommand;

  let snippetRepository: MockProxy<SnippetsRepository>;

  let snippet: Snippet;

  beforeEach(() => {
    snippetRepository = mock<SnippetsRepository>();
    deleteSnippetCommand = new DeleteSnippetCommand(snippetRepository);
    snippet = Snippet.create({
      name: 'test',
      description: 'test',
      body: 'test',
      filePath: '/path/to/file.snippet.yaml',
      id: '1234',
      conditions: {
        language: 'javascript',
      },
      folder: new SnippetFolder('test folder', '/path/to/folder'),
    } as SnippetProps);
  });

  it('should delete snippet', async () => {
    deleteSnippetCommand.execute(snippet);

    expect(snippetRepository.delete).toBeCalledTimes(1);
  });
});*/
