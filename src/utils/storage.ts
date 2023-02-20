import { WorkspaceConfiguration, ExtensionContext } from 'vscode';
import { CONFIG_KEY_SNIPPETS_PATH } from '../constants';
import * as fs from 'fs';
import { mkdirp } from 'mkdirp';

/**
 * Initialize the storage for the snippets.
 */
export function initializeStorage(config: WorkspaceConfiguration, context: ExtensionContext): string {
  if (config.has(CONFIG_KEY_SNIPPETS_PATH)) {
    return config.get<string>(CONFIG_KEY_SNIPPETS_PATH) || '';
  }

  const snippetsPath = `${context.globalStorageUri.path}/snippets`;

  if (!fs.existsSync(snippetsPath)) {
    mkdirp.sync(snippetsPath);
  }

  return snippetsPath;
}
