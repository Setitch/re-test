import {npmExecute} from '../npm-execute';

export const install = async(targetDir: string) => {
  const data = await npmExecute(`i`, targetDir);
}
