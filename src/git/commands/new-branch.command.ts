import { gitExecute } from '../gitExecute';

export const newBranch = async (repoDir: string, branchName: string, keyFile?: string) => {
  const data = await gitExecute(`checkout -b "${ branchName }"`, repoDir, keyFile);
}
