// vscode.js

const window = {
  showInformationMessage: jest.fn(),
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  createTextEditorDecorationType: jest.fn(),
  showInputBox: jest.fn(),
};

const vscode = {
  window,
};

module.exports = vscode;
