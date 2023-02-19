import { SnippetFolder } from '../domain/folder';
import { FolderQuickPickItem } from './folderQuickPick';

describe('FolderQuickPickItem', () => {
  it('should create a FolderQuickPickItem with the correct properties', () => {
    const folder = new SnippetFolder('myFolder', '/some/path');
    const item = new FolderQuickPickItem(folder);
    expect(item.folder).toBe(folder);
    expect(item.label).toBe('myFolder');
    expect(item.isNew).toBe(false);
  });
});
