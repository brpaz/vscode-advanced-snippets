import { v4 as uuidv4 } from 'uuid';
import { SnippetFolder } from './folder';

export enum PackageFormat {
  NPM = 'npm',
  GOMOD = 'gomod',
}

export interface PackageCondition {
  name: string;
  format: PackageFormat;
}

export interface SnippetConditions {
  language: string;
  filePatterns?: string[];
  packages?: PackageCondition[];
  workspaceFolders?: string[];
}

export interface SnippetProps {
  id?: string;
  name: string;
  body: string;
  filePath?: string;
  conditions: SnippetConditions;
  folder: SnippetFolder;
}

export class Snippet {
  private id: string;
  private name: string;
  private body: string;
  private conditions: SnippetConditions;
  private folder: SnippetFolder;

  private constructor(id: string, name: string, body: string, conditions: SnippetConditions, folder: SnippetFolder) {
    this.id = id;
    this.name = name;
    this.body = body;
    this.conditions = conditions;
    this.folder = folder;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getBody(): string {
    return this.body;
  }

  public setBody(body: string): void {
    this.body = body;
  }

  public getConditions(): SnippetConditions {
    return this.conditions;
  }

  public getFolder(): SnippetFolder {
    return this.folder;
  }

  public setFolder(folder: SnippetFolder): void {
    this.folder = folder;
  }

  public getFileName(): string {
    return `${this.id}.snippet.yaml`;
  }

  public getFilePath(): string {
    return `${this.folder.getPath()}/${this.getFileName()}`;
  }

  public getLanguage(): string {
    return this.conditions.language;
  }

  public static create(props: SnippetProps): Snippet {
    const id = props.id || uuidv4();
    return new Snippet(id, props.name, props.body, props.conditions, props.folder);
  }
}
