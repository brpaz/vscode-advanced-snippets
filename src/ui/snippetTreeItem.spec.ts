import * as vscode from 'vscode';
import { SnippetFolder } from '../domain/folder';
import { Snippet } from '../domain/snippet';
import { SnippetTreeItem } from './snippetTreeItem';

describe('SnippetTreeItem', () => {
  const snippet = Snippet.create({
    id: 'mySnippet',
    name: 'mySnippet',
    body: 'mySnippetBody',
    conditions: { language: 'typescript' },
    folder: new SnippetFolder('myFolder', '/some/path'),
  });

  const snippetFolder = new SnippetFolder('myFolder', '/some/path');

  describe('constructor', () => {
    it('should set the name and contextValue properties for a snippet', () => {
      const item = new SnippetTreeItem(snippet);
      expect(item.label).toBe('mySnippet');
      expect(item.contextValue).toBe('snippetFile');
    });

    it('should set the name and contextValue properties for a snippet folder', () => {
      const item = new SnippetTreeItem(snippetFolder);
      expect(item.label).toBe('myFolder');
      expect(item.contextValue).toBe('snippetFolder');
    });

    it('should set the collapsibleState property to Expanded for a snippet folder', () => {
      const item = new SnippetTreeItem(snippetFolder);
      expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.Expanded);
    });

    it('should set the collapsibleState property to None for a snippet', () => {
      const item = new SnippetTreeItem(snippet);
      expect(item.collapsibleState).toBe(vscode.TreeItemCollapsibleState.None);
    });
  });
});
