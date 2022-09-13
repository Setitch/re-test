import rimraf from 'rimraf';

export const removeDirectory = async (directory: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    rimraf(directory, (err) => {
      if (err) {
        return reject(err);
      }
      
      return resolve();
    })
  });
}
