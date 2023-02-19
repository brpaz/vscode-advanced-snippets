import { languages } from './languages';

describe('languages', () => {
  it('should be an array', () => {
    expect(Array.isArray(languages)).toBe(true);
  });

  it('should contain a specific set of languages', () => {
    const expectedLanguages = [
      'abap',
      'bat',
      'bibtext',
      'coffeescript',
      'cpp',
      'c',
      'cuda-cpp',
      'css',
      'dockerfile',
      'diff',
      'fsharp',
      'git-commit',
      'git-rebase',
      'go',
      'groovy',
      'handlebars',
      'html',
      'ini',
      'java',
      'javascript',
      'json',
      'less',
      'lua',
      'makefile',
      'markdown',
      'objective-c',
      'objective-cpp',
      'perl',
      'php',
      'plaintext',
      'postiats',
      'powershell',
      'pug',
      'python',
      'r',
      'razor',
      'ruby',
      'rust',
      'scss',
      'shaderlab',
      'shellscript',
      'sql',
      'swift',
      'typescript',
      'vb',
      'xml',
      'yaml',
    ];
    expect(languages).toEqual(expectedLanguages);
  });
});
