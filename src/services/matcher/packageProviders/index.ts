import { PackageFormat } from '../../../domain/snippet';

export interface PackageProvider {
  hasPackage(name: string, currentFilePath: string, workspaceDir: string): boolean;
  getKey(): string;
}

export interface IPackageProviderFactory {
  getProvider(format: PackageFormat): PackageProvider;
}
