import { PackageFormat, Snippet, SnippetFolder } from '../domain/snippet';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'yaml';

interface SnippetYamlFile {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
  };
  spec: {
    body: string;
    conditions: {
      language: string;
      file_patterns?: string[];
      packages?: {
        name: string;
        format: string;
      }[];
    };
  };
}

export interface LoadResult {
  folders: SnippetFolder[];
  snippets: Snippet[];
}

export interface SnippetsLoader {
  load(): LoadResult;
  persist(snippets: Snippet): Snippet;
}

export class FileSnippetsLoader implements SnippetsLoader {
  constructor(private snippetsRoot: string) {}

  load(): LoadResult {
    const snippets: Snippet[] = [];

    const folderEntries = this.getFolders();

    const folders = folderEntries.map((folder) => {
      return new SnippetFolder(folder.name, path.join(this.snippetsRoot, folder.name));
    });

    for (const folder of folderEntries) {
      const folderPath = path.join(this.snippetsRoot, folder.name);

      const snippetsInFolder = this.readSnippetsInFolder(folderPath);

      if (snippetsInFolder.length > 0) {
        snippets.push(...snippetsInFolder);
      }
    }

    return { folders, snippets };
  }

  persist(snippet: Snippet): Snippet {
    const data: SnippetYamlFile = {
      apiVersion: 'vscode-snippets.brunopaz.dev/v1',
      kind: 'Snippet',
      metadata: {
        name: snippet.getName(),
      },
      spec: {
        body: snippet.getBody(),
        conditions: {
          language: snippet.getConditions().language,
          file_patterns: snippet.getConditions().filePatterns,
          packages: snippet.getConditions().packages?.map((pkg) => {
            return {
              name: pkg.name,
              format: pkg.format,
            };
          }),
        },
      },
    };

    fs.writeFileSync(snippet.getPath(), yaml.stringify(data));

    return snippet;
  }

  private getFolders(): fs.Dirent[] {
    const files = fs.readdirSync(this.snippetsRoot, { withFileTypes: true });

    return files.filter((files) => files.isDirectory());
  }

  private readSnippetsInFolder(folderPath: string): Snippet[] {
    const snippets: Snippet[] = [];
    const snippetFiles = fs.readdirSync(folderPath);

    for (const snippetFile of snippetFiles) {
      if (!snippetFile.endsWith('.yaml')) {
        continue;
      }

      const snippetFilePath = path.join(folderPath, snippetFile);

      const fileData: SnippetYamlFile = yaml.parse(fs.readFileSync(snippetFilePath, 'utf8'));

      const snippet = new Snippet(
        fileData.metadata.name,
        fileData.spec.body,
        new SnippetFolder(path.basename(folderPath), folderPath),
        {
          language: fileData.spec.conditions.language,
          filePatterns: fileData.spec.conditions.file_patterns,
          packages: fileData.spec.conditions.packages?.map((pkg) => {
            return {
              name: pkg.name,
              format: pkg.format as PackageFormat,
            };
          }),
        },
      );

      snippets.push(snippet);
    }

    return snippets;
  }
}
