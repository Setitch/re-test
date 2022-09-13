import { gitExecute } from '../gitExecute';

export const createPullRequest = async (repoDir: string, repositoryAddress: string, keyFile?: string) => {
  const data = await gitExecute(`request-pull HEAD~1 ${repositoryAddress}`, repoDir, keyFile);
}
