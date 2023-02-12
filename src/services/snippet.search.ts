import * as pm from 'picomatch';
import { TextDocument } from 'vscode';
import { Snippet } from '../domain/snippet';
import SnippetsRepository from './snippet.repository';

export interface ISearch {
  search(document: TextDocument): Snippet[];
}

export class SearchService implements ISearch {
  constructor(private snippetsRepository: SnippetsRepository) {}
  search(document: TextDocument): Snippet[] {
    const allSnippets = this.snippetsRepository.getAll();

    let filteredSnippets = allSnippets;

    filteredSnippets = this.filterByLanguage(document, filteredSnippets);

    filteredSnippets = this.filterByFilePattern(document, filteredSnippets);

    return filteredSnippets;
  }

  private filterByFilePattern(document: TextDocument, filteredSnippets: Snippet[]): Snippet[] {
    return filteredSnippets.filter((snippet) => {
      const patterns = snippet.getConditions().filePatterns;
      if (!patterns) {
        return true;
      }

      return patterns.some((filePattern) => pm.isMatch(filePattern, document.fileName));
    });
  }

  private filterByLanguage(document: TextDocument, snippets: Snippet[]): Snippet[] {
    const language = document.languageId;
    return snippets.filter((snippet) => snippet.getLanguage() === language);
  }
}
