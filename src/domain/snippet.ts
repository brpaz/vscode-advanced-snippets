import { v4 as uuidv4 } from 'uuid';

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
}

export class Snippet {
  private id: string;
  private name: string;
  private body: string;
  private conditions: SnippetConditions;
  private folder: SnippetFolder;

  constructor(name: string, body: string, folder: SnippetFolder, conditions: SnippetConditions) {
    this.id = `${uuidv4()}-${name.toLowerCase().replaceAll(' ', '-')}`;
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

  public getBody(): string {
    return this.body;
  }

  public getConditions(): SnippetConditions {
    return this.conditions;
  }

  public getFolder(): SnippetFolder {
    return this.folder;
  }
}

export class SnippetFolder {
  private name: string;
  private path: string;

  constructor(name: string, path: string) {
    this.name = name;
    this.path = path;
  }

  public getName(): string {
    return this.name;
  }

  public getPath(): string {
    return this.path;
  }
}
