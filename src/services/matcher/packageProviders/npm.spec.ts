import { fs, vol } from 'memfs';

import NpmProvider from './npm';

jest.mock('fs', () => fs);

describe('NpmProvider', () => {
  let provider: NpmProvider;

  beforeAll(() => {
    // Set up package.json files for testing
    const packageJson1 = {
      dependencies: {
        'my-dependency': '^1.0.0',
      },
    };
    const packageJson2 = {
      devDependencies: {
        'my-dev-dependency': '^2.0.0',
      },
    };
    vol.mkdirSync('/project1');
    vol.writeFileSync('/project1/package.json', JSON.stringify(packageJson1));
    vol.mkdirSync('/project2');
    vol.writeFileSync('/project2/package.json', JSON.stringify(packageJson2));
  });

  beforeEach(() => {
    provider = new NpmProvider();
  });

  describe('hasPackage', () => {
    it('returns true if package is a direct dependency', () => {
      const result = provider.hasPackage('/project1/src/index.js', '/project1', 'my-dependency');
      expect(result).toBe(true);
    });

    it('returns true if package is a dev dependency', () => {
      const result = provider.hasPackage('/project2/src/index.js', '/project2', 'my-dev-dependency');
      expect(result).toBe(true);
    });

    it('returns false if package is not a dependency', () => {
      const result = provider.hasPackage('/project1/src/index.js', '/project1', 'not-a-dependency');
      expect(result).toBe(false);
    });

    it('returns false if no package.json file is found', () => {
      const result = provider.hasPackage('/project3/src/index.js', '/project3', 'my-dependency');
      expect(result).toBe(false);
    });
  });
});
