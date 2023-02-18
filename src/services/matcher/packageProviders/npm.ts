import * as fs from 'fs';
import * as path from 'path';
import { PackageFormat } from '../../../domain/snippet';
import { PackageProvider } from './index';

export default class NpmProvider implements PackageProvider {
  public hasPackage(currentFilePath: string, workspaceRootDir: string, name: string): boolean {
    const packageJsonPath = this.findPackageJSON(path.dirname(currentFilePath), workspaceRootDir);

    if (!packageJsonPath) {
      return false;
    }

    return this.hasDependency(packageJsonPath, name);
  }

  getKey(): string {
    return PackageFormat.NPM;
  }

  private findPackageJSON(startPath: string, targetDirectory: string): string | undefined {
    if (path.basename(startPath) === targetDirectory) {
      return startPath;
    }

    const packageJsonPath = path.join(startPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return `${startPath}/package.json`;
    }

    const parentPath = path.dirname(startPath);
    if (parentPath === startPath) {
      return undefined;
    }

    return this.findPackageJSON(parentPath, targetDirectory);
  }

  private hasDependency(packageJsonPath: string, name: string): boolean {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (
      (packageJson.dependencies && packageJson.dependencies[name]) ||
      (packageJson.devDependencies && packageJson.devDependencies[name])
    ) {
      return true;
    }

    return false;
  }
}
