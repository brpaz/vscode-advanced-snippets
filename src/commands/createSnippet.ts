import SnippetsRepository from '../services/snippet.repository';

export default class CreateSnippetCommand {
  constructor(private snippetsRepository: SnippetsRepository) {}
  execute() {
    console.log('CreateSnippetCommand');
  }
}
