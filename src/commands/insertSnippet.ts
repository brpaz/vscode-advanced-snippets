import SnippetsRepository from '../services/snippet.repository';

export default class InsertSnippetCommand {
  constructor(private snippetsRepository: SnippetsRepository) {}
  execute() {
    console.log('InsertSnippetCommand');
  }
}
