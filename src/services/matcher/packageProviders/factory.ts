import { IPackageProviderFactory, PackageProvider } from '.';
import { PackageFormat } from '../../../domain/snippet';
import GomodProvider from './gomod';
import NpmProvider from './npm';

export default class PackageProviderFactory implements IPackageProviderFactory {
  private readonly providers: PackageProvider[] = [];

  constructor() {
    this.providers.push(new NpmProvider());
    this.providers.push(new GomodProvider());
  }

  getProvider(format: PackageFormat): PackageProvider {
    const provider = this.providers.find((p) => p.getKey() === format);
    if (!provider) {
      throw new Error(`Provider for ${format} format not found`);
    }
    return provider;
  }
}
