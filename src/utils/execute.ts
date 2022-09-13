import { spawn } from "node:child_process";

export const execute = (command: string, targetDir?: string): Promise<[string, string]> => {
  return new Promise((resolve, reject) => {
    const execution = spawn(command, {shell: true, cwd: targetDir});
    const outputs: Record<'both'|'out'|'err', string[]> = {
      out: [],
      err: [],
      both: [],
    };
    let spawnError: Error;
    
    execution.on('spawn', () => {
      if (targetDir) {
        console.info(`Executing [in: ${targetDir}] command: ${command}`);
      } else {
        console.info(`Executing command: ${command}`);
      }
    })
    execution.stderr.on('data', (data) => {
      const str = data.toString();

      outputs.err.push(str);
      outputs.both.push(str);
  
      console.info(` -> ${str}`);
    });
    
    execution.stdout.on('data', (data) => {
      const str = data.toString();
  
      outputs.out.push(str);
      outputs.both.push(str);
  
      console.info(` -> ${str}`);
    });
    
    execution.on('error', (err) => {
      spawnError = err;
    })
    
    execution.on('close', (code) => {
      if (code === 0) {
        return resolve([ outputs.out.join('\n'), outputs.err.join('\n') ]);
      } else {
        return reject(spawnError ? spawnError : new Error(outputs.both.join('\n')));
      }
    });
  });
}
