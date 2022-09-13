import { execute }              from '../utils/execute';

export const npmExecute = async (command: string, targetDir: string): Promise<[string, string]> => await execute(`npm ${ command }`, targetDir);
