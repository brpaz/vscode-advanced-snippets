import * as vscode from 'vscode';
import { SnippetsRepository } from '../domain/repository';
import { mock, MockProxy } from 'jest-mock-extended';
import CreateFolderCommand from './createFolder';

describe('CreateFolderCommand', () => {
  let snippetsRepository: MockProxy<SnippetsRepository>;
  let createFolderCommand: CreateFolderCommand;

  beforeEach(() => {
    snippetsRepository = mock<SnippetsRepository>();
    createFolderCommand = new CreateFolderCommand(snippetsRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a folder when the user enters a valid name', async () => {
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue('New Folder');

      await createFolderCommand.execute();

      expect(snippetsRepository.createFolder).toHaveBeenCalledWith('New Folder');
      expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Folder New Folder was created successfully');
    });

    it('should not create a folder when the user cancels input', async () => {
      (vscode.window.showInputBox as jest.Mock).mockResolvedValue(undefined);
      await createFolderCommand.execute();
      expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
    });
  });
});
