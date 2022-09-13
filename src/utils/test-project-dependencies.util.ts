import { test } from '../npm/commands/test.command';

export const testProjectDependencies = async (repoDir: string, testCommand?: string) => test(repoDir, testCommand);
