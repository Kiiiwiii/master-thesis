import { execFile as exec } from 'child_process';
import * as path from 'path';
import GLOBAL from './global';
const destinationRoot = GLOBAL.filePath;

const convertIfcCmd = path.resolve(__dirname + '/../public/ifcConvert/IfcConvert-Ifc4');

function ifc2ObjAndMtl(ifcFileName: string, filePrefix: string): Promise<Partial<ArchitectureFile>> {
  return new Promise((resolve, reject) => {
    exec(convertIfcCmd, [`${destinationRoot}/${ifcFileName}`, `${destinationRoot}/${filePrefix}.obj`], (err: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        objFileName: `${filePrefix}.obj`,
        mtlFileName: `${filePrefix}.mtl`,
      });
    });
  });
}

function convertIfc(ifcFileName: string, index: number): Promise<Partial<ArchitectureFile>> {
  return ifc2ObjAndMtl(ifcFileName, `${Date.now()}-${index}`);
}

export default convertIfc;
