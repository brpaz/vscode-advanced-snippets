import { fs, vol } from 'memfs';
import GomodProvider from './gomod';

jest.mock('fs', () => fs);

describe('GomodProvider', () => {
  let provider: GomodProvider;

  beforeAll(() => {
    vol.mkdirSync('/project1');
    vol.writeFileSync('/project1/go.mod', 'module example.com/project\ngo 1.16\nrequire example.com/dependency v1.0.0');
  });

  beforeEach(() => {
    provider = new GomodProvider();
  });

  describe('hasPackage', () => {
    it('returns true if package is a direct dependency', () => {
      const result = provider.hasPackage('dependency', '/project1/main.go', '/project1');
      expect(result).toBe(true);
    });

    it('returns true if package is a direct in an upper directory', () => {
      const result = provider.hasPackage('dependency', '/project1/src/internal/main.go', '/project1');
      expect(result).toBe(true);
    });

    it('returns false if gomod doesn´t include dependency', () => {
      const result = provider.hasPackage('unkdnown-dependency', '/project2/src/main.go', '/project2');
      expect(result).toBe(false);
    });
  });
});
