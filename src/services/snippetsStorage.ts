import { PackageFormat, Snippet } from '../domain/snippet';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'yaml';
import { SnippetFolder } from '../domain/folder';

interface SnippetYamlFile {
  apiVersion: string;
  kind: string;
  metadata: {
    uid: string;
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

export interface SnippetsStorage {
  load(): LoadResult;
  loadFile(filePath: string): Snippet;
  persist(snippets: Snippet): Snippet;
}

export class FilesystemSnippetsStorage implements SnippetsStorage {
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

  loadFile(filePath: string): Snippet {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Snippet file with the path ${filePath} does not exist`);
    }

    const fileData: SnippetYamlFile = yaml.parse(fs.readFileSync(filePath, 'utf8'));

    return this.mapSnippet(filePath, fileData);
  }

  persist(snippet: Snippet): Snippet {
    const data: SnippetYamlFile = {
      apiVersion: 'vscode-snippets.brunopaz.dev/v1',
      kind: 'Snippet',
      metadata: {
        uid: snippet.getId(),
        name: snippet.getName(),
      },
      spec: {
        body: snippet.getBody(),
        conditions: {
          language: snippet.getConditions().language,
          file_patterns: snippet.getConditions().filePatterns || [],
          packages: snippet.getConditions().packages?.map((pkg) => {
            return {
              name: pkg.name,
              format: pkg.format,
            };
          }),
        },
      },
    };

    fs.writeFileSync(snippet.getFilePath(), yaml.stringify(data));

    return snippet;
  }

  private getFolders(): fs.Dirent[] {
    const files = fs.readdirSync(this.snippetsRoot, { withFileTypes: true });

    if (files.length === 0) {
      return [];
    }

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

      const snippet = this.mapSnippet(snippetFilePath, fileData);

      snippets.push(snippet);
    }

    return snippets;
  }

  private mapSnippet(filePath: string, fileData: SnippetYamlFile): Snippet {
    const folderPath = path.dirname(filePath);

    return Snippet.create({
      id: fileData.metadata.uid,
      name: fileData.metadata.name,
      body: fileData.spec.body,
      folder: new SnippetFolder(path.basename(folderPath), folderPath),
      conditions: {
        language: fileData.spec.conditions.language,
        filePatterns: fileData.spec.conditions.file_patterns || [],
        packages: fileData.spec.conditions.packages?.map((pkg) => {
          return {
            name: pkg.name,
            format: pkg.format as PackageFormat,
          };
        }),
      },
    });
  }
}
