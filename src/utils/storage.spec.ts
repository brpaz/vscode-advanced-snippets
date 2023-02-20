jest.mock('fs');

import { initializeStorage } from './storage';
import { WorkspaceConfiguration, ExtensionContext } from 'vscode';
import * as fs from 'fs';
import { mkdirp } from 'mkdirp';

// Mock the required VS Code classes
const mockWorkspaceConfig = { has: jest.fn(), get: jest.fn() };
const mockContext = { globalStorageUri: { path: '/path/to/globalStorage' } };

describe('initializeStorage', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('returns the custom snippets path from the workspace configuration', () => {
    // Configure the mock to return the custom snippets path
    mockWorkspaceConfig.has.mockReturnValue(true);
    mockWorkspaceConfig.get.mockReturnValue('/path/to/custom/snippets');

    const snippetsPath = initializeStorage(
      mockWorkspaceConfig as unknown as WorkspaceConfiguration,
      mockContext as unknown as ExtensionContext,
    );

    expect(snippetsPath).toBe('/path/to/custom/snippets');
  });

  it('creates the snippets directory if it does not exist', () => {
    // Configure the mock to return false for directory existence
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const mkdirSpy = jest.spyOn(mkdirp, 'sync');

    const snippetsPath = initializeStorage(
      mockWorkspaceConfig as unknown as WorkspaceConfiguration,
      mockContext as unknown as ExtensionContext,
    );

    expect(snippetsPath).toBe('/path/to/globalStorage/snippets');
    expect(mkdirSpy).toHaveBeenCalledWith('/path/to/globalStorage/snippets');
  });

  it('returns the default snippets path if no custom path is set and the directory exists', () => {
    // Configure the mock to return false for the custom snippets path existence
    jest.spyOn(fs, 'existsSync').mockImplementation((path) => {
      return path !== '/path/to/custom/snippets';
    });

    const snippetsPath = initializeStorage(
      mockWorkspaceConfig as unknown as WorkspaceConfiguration,
      mockContext as unknown as ExtensionContext,
    );

    expect(snippetsPath).toBe('/path/to/globalStorage/snippets');
  });
});
