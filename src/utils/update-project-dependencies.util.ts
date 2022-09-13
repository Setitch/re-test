import {install} from '../npm/commands/install.command';

export const updateProjectDependencies = async (repoDir: string) => install(repoDir);
