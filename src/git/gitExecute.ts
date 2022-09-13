import { execute }              from '../utils/execute';

export const gitExecute = async (command: string, repoDir?: string, keyFile?: string): Promise<[string, string]> => await execute(`git ${keyFile ? `-c core.sshCommand="ssh -o IdentitiesOnly=yes -i ${keyFile}"` : ''} ${ command }`, repoDir);
