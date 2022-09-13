import {npmExecute} from '../npm-execute';

export const test = async(targetDir: string, testCommand?: string) => {
  const data = await npmExecute(`run ${testCommand ? testCommand : 'test'}`, targetDir);
}
