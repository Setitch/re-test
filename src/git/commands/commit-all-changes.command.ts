import { gitExecute } from '../gitExecute';

export const commitAllChanges = async (repoDir: string, branchName: string, comment: string, keyFile?: string): Promise<string> => {
  await gitExecute(`commit -a -m "${ comment }"`, repoDir, keyFile);
  await gitExecute(`push --set-upstream origin "${ branchName }"`, repoDir, keyFile);
  
  const data = await gitExecute('rev-parse HEAD', repoDir);
  
  return data[0];
}
