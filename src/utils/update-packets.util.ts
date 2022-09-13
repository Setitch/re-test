import { PacketUpdateData, SignType } from './validate-packets-structure.util';


type DependencyVersionString = `${SignType}${string}`;
export interface DependencyType {
  [key: string]: DependencyVersionString;
}


export const updatePackets = (json: DependencyType, packetsToUpdate: PacketUpdateData[]) => {
  console.log('Updating', json, 'with', packetsToUpdate);
  for (const {packet, version, sign} of packetsToUpdate) {
    if (json.hasOwnProperty(packet)) {
      console.info(`   Updating [${packet}] from [${json[packet]}] into [${sign}${version}]`);

      json[packet] = `${sign}${version}`;
    } else {
      console.warn(`   Packet [${packet}] not found, not updating`);
    }
  }
  
  return json;
}
