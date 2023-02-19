import * as path from 'path';
import * as fs from 'fs';
import { PackageFormat } from '../../../domain/snippet';
import { PackageProvider } from './index';

export default class GomodProvider implements PackageProvider {
  getKey(): string {
    return PackageFormat.GOMOD;
  }

  hasPackage(name: string, currentFilePath: string, workspaceRootDir: string): boolean {
    const goModPath = this.findGoMod(path.dirname(currentFilePath), workspaceRootDir);

    if (!goModPath) {
      return false;
    }

    return this.hasDependency(goModPath, name);
  }

  private findGoMod(startPath: string, targetDirectory: string): string | undefined {
    if (path.basename(startPath) === targetDirectory) {
      return startPath;
    }

    const goModPath = path.join(startPath, 'go.mod');
    if (fs.existsSync(goModPath)) {
      return `${startPath}/go.mod`;
    }

    const parentPath = path.dirname(startPath);
    if (parentPath === startPath) {
      return undefined;
    }

    return this.findGoMod(parentPath, targetDirectory);
  }

  private hasDependency(goModPath: string, name: string): boolean {
    const goMod = fs.readFileSync(goModPath, 'utf8');

    if (goMod.includes(name)) {
      return true;
    }

    return false;
  }
}
