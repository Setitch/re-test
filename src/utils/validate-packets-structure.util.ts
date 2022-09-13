import { ValidationException } from '../exceptions/generic/validation.generic-exception';
import { valid }               from 'semver';

export type SignType = '+'|'^'|'';

export interface PacketUpdateData {packet: string; version: string; sign: SignType}

export const validatePacketsStructure = (input: string[]): PacketUpdateData[] => {
  return input.map((row) => {
    const split = row.split(',');
    let sign: SignType = '';

    if (split.length !== 2) throw new ValidationException(`Wrong format for packet and version. Got [${row}]. Should be [string,semver]`);
    if (split[1].startsWith('^') || split[1].startsWith('+')) {
      sign = split[1][0] as SignType;
      split[1] = split[1].substr(1);
    }
    
    if (!valid(split[1])) throw new ValidationException(`Wrong format for packet version [${row}]. Version [${split[1]}] is not a semver version!`);
    
    return {packet: split[0], version: split[1], sign};
  });
}
