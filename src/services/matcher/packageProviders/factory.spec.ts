import PackageProviderFactory from './factory';
import NpmProvider from './npm';
import GomodProvider from './gomod';
import { PackageFormat } from '../../../domain/snippet';

describe('PackageProviderFactory', () => {
  it('should get an instance of NpmProvider for "npm" format', () => {
    const factory = new PackageProviderFactory();
    const provider = factory.getProvider(PackageFormat.NPM);
    expect(provider).toBeInstanceOf(NpmProvider);
  });

  it('should get an instance of GomodProvider for "gomod" format', () => {
    const factory = new PackageProviderFactory();
    const provider = factory.getProvider(PackageFormat.GOMOD);
    expect(provider).toBeInstanceOf(GomodProvider);
  });

  it('should throw an error when format is not supported', () => {
    const factory = new PackageProviderFactory();
    expect(() => {
      factory.getProvider('invalidFormat' as PackageFormat);
    }).toThrowError('Provider for invalidFormat format not found');
  });
});
