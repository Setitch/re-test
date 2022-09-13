import { join }       from 'node:path';
import { gitExecute } from '../gitExecute';

type RepositoryDir = string;

export const clone = async (repositoryAddress: string, keyFile?: string): Promise<RepositoryDir> => {
  const targetDir = join(process.env.TMP_DIR || '', Math.random().toString());
  await gitExecute(`clone "${ repositoryAddress }" ${ targetDir }`, undefined, keyFile);
  
  return targetDir;
}
