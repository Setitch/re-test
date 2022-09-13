import { execute }    from '../utils/execute';
import { npmExecute } from './npm-execute';
import Mock = jest.Mock;

jest.mock('../utils/execute', () => ({
  execute: jest.fn(),
}));

describe('npm-execute', () => {
  it('execute command with targetDir', async () => {
    await npmExecute('command', 'targetDir');
    
    const mock = (execute as Mock).mock;
    
    expect(mock.calls[0]).toEqual(['npm command', 'targetDir']);
  });
});

export {}
