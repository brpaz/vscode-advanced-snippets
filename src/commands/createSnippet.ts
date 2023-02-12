import * as vscode from 'vscode';
import SnippetsRepository from '../services/snippet.repository';

const snippetTemplate = `
apiVersion: snippets.brunopaz.dev/v1
kind: Snippet
metadata:
  name: \${1:snippet-name}
spec:
  body: |
    console.log("Hello world!")
  conditions:
    language: javascript
    filePatters:
      - "**/*.js"
    packages:
      - name: react
        format: npm
    workspaceRoots:
      - vscode-advanced-snippets
`;

export default class CreateSnippetCommand {
  constructor(private snippetsRepository: SnippetsRepository) {}
  execute() {
    console.log('hello');
  }
}
