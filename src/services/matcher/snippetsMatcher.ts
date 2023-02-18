import * as pm from 'picomatch';
import { TextDocument } from 'vscode';
import { SnippetsRepository } from '../../domain/repository';
import { Snippet } from '../../domain/snippet';
import { IPackageProviderFactory } from './packageProviders';

export interface Matcher {
  match(document: TextDocument, rootDir: string): Snippet[];
}

export class MatcherService implements Matcher {
  constructor(
    private snippetsRepository: SnippetsRepository,
    private packageProviderFactory: IPackageProviderFactory,
  ) {}
  match(document: TextDocument, rootDir: string): Snippet[] {
    const allSnippets = this.snippetsRepository.getAll();

    let filteredSnippets = allSnippets;

    filteredSnippets = this.filterByLanguage(document, filteredSnippets);

    filteredSnippets = this.filterByFilePattern(document, filteredSnippets);

    filteredSnippets = this.filterByPackage(document, filteredSnippets, rootDir);

    return filteredSnippets;
  }

  /**
   *  Filters the snippets based on whether the document meets their package requirements.
   */
  filterByPackage(document: TextDocument, filteredSnippets: Snippet[], rootDir: string): any {
    return filteredSnippets.filter((snippet) => {
      const packagePatterns = snippet.getConditions().packages;
      if (!packagePatterns) {
        return true;
      }
      return packagePatterns.some((packagePattern) =>
        this.packageProviderFactory
          .getProvider(packagePattern.format)
          .hasPackage(packagePattern.name, document.fileName, rootDir),
      );
    });
  }

  private filterByFilePattern(document: TextDocument, filteredSnippets: Snippet[]): Snippet[] {
    return filteredSnippets.filter((snippet) => {
      const patterns = snippet.getConditions().filePatterns;
      if (!patterns) {
        return true;
      }

      return patterns.some((filePattern) => pm.isMatch(document.fileName, filePattern, { dot: true }));
    });
  }

  private filterByLanguage(document: TextDocument, snippets: Snippet[]): Snippet[] {
    const language = document.languageId;
    return snippets.filter((snippet) => snippet.getLanguage() === language);
  }
}
