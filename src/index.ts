import { join }                          from 'node:path';
import * as mkdirp                       from 'mkdirp';
import {program, Argument}               from 'commander';
import { promisify }                     from 'util';
import fs                                from 'node:fs';
import { clone }                         from './git/commands/clone.command';
import { commitAllChanges }              from './git/commands/commit-all-changes.command';
import { createPullRequest }             from './git/commands/create-pull-request.command';
import { newBranch }                     from './git/commands/new-branch.command';
import { getFileIndentation }            from './utils/get-file-indentation.util';
import { removeDirectory }               from './utils/remove-directory.util';
import { testProjectDependencies }       from './utils/test-project-dependencies.util';
import { DependencyType, updatePackets } from './utils/update-packets.util';
import { validatePacketsStructure }      from './utils/validate-packets-structure.util';
import { WrapExceptions }                from './utils/wrap-exceptions.util';
import {updateProjectDependencies}       from './utils/update-project-dependencies.util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

if (!process.env.TMP_DIR || process.env.TMP_DIR === '') {
  process.env.TMP_DIR = join(__dirname, '..', '..', 'tmp');
} else {
  process.env.TMP_DIR = join(process.env.TMP_DIR, 'tmp');
}


// TODO: Should also clean this dir (remove everything) at start of the project to have a clean start - just in case. Like each several executions.
console.log(`Using temporary dir: ${process.env.TMP_DIR}`);
console.log(`    ${mkdirp.sync(join(__dirname, '..', 'tmp')) ? 'CREATED' : 'OK'}`);

program
  .storeOptionsAsProperties()
  .description('Usage: node index <repositoryUrl> -p packetName,semVer')
  .addArgument(new Argument('<string>', 'repository to update'))
  .requiredOption('-p, --packets <string...>', 'packet and its version to update separated by comma')
  // todo: for some reason on windows, i cannot make it working with key for bitbucket, even if key is proper
  // TODO 2: for other reason (similar probably) access-key nor full-key can be used on bitbucket (i have added them(registered) with bitbucket, but they are still not recognized
  // Setitch@bitbucket.org: Permission denied (publickey).
  // kex_exchange_identification: Connection closed by remote host
  .option('-k, --key <string>', 'direct path for private key used for repository')
  // TODO: remove - no longer supported
  // .option('--user <string>', 'username for accessing repository (-k has precedence)')
  // .option('--pass <string>', 'password for accessing repository (-k has precedence)')
  .option('-t, --testCommand <string>', 'test command to run with npm run <string>, defaults to "test"')
  // TODO: move content of this function to function, so we can test it as a whole - now this full function is untestable
  .action((repositoryAddress, options) => WrapExceptions(async () => {
    const packetsToUpdate = validatePacketsStructure(options.packets);
    const repoDir = await clone(repositoryAddress, options.key);
    console.log(` Cloned Properly into`, repoDir);
    
    console.log(`Reading package.json file`);
    const packageFile = (await readFile(join(repoDir, 'package.json'))).toString();
    const packageJson = JSON.parse(packageFile);
    console.log(`  Done`);
    if (packageJson.dependencies) packageJson.dependencies = updatePackets(packageJson.dependencies as DependencyType, packetsToUpdate);
    if (packageJson.devDependencies) packageJson.devDependencies = updatePackets(packageJson.devDependencies as DependencyType, packetsToUpdate);
    
    console.log(`Writing changed into package.json file`);
    const updatedContent = `${JSON.stringify(packageJson, null, getFileIndentation(packageFile))}${packageFile.slice(-1)}`;
    await writeFile(join(repoDir, 'package.json'), updatedContent);
    console.log(`  Done`);
    
    
    console.log(`Running install`);
    await updateProjectDependencies(repoDir);
    console.log(`  Done`);
    
    console.log(`Running tests`);
    if (packageJson?.scripts?.test) {
        await testProjectDependencies(repoDir, options.testCommand);
        console.log(`  Done`);
    } else {
        console.log(`  No test script available...`);
    }
    
    const branchNameToUse = 'dynamic-branch-name-for-changes-' + Math.floor(Math.random() * 1000);
    console.log(`Making new branch`);
    await newBranch(repoDir, branchNameToUse, options.key);
    console.log(`  Done`);
    
    console.log(`Committing changes`);
    const commitHash = await commitAllChanges(repoDir, branchNameToUse, 'automatic updating packages', options.key);
    console.log(`  Done`);
    
    console.log('Requesting PR');
    // TODO: Could not test before finishing - needs to be finished
    await createPullRequest(repoDir, repositoryAddress, options.key);
    console.log(`  Done`);
    
    console.log('Cleaning');
    await removeDirectory(repoDir);
    console.log(`  Done`);
  }))
;

program.parse();
