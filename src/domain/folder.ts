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
