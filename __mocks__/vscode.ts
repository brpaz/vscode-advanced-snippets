// vscode.js

enum TreeItemCollapsibleState {
  /**
   * Determines an item can be neither collapsed nor expanded. Implies it has no children.
   */
  None = 0,
  /**
   * Determines an item is collapsed
   */
  Collapsed = 1,
  /**
   * Determines an item is expanded
   */
  Expanded = 2,
}

class MockTreeItem {
  constructor(private label: string) {}
}

const TreeItem = MockTreeItem;

const windowMock = {
  showInformationMessage: jest.fn(),
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  createTextEditorDecorationType: jest.fn(),
  showInputBox: jest.fn(),
};

const vscode = {
  window: windowMock,
  TreeItem,
  TreeItemCollapsibleState,
};

module.exports = vscode;
