import {execFile as exec} from 'child_process';
import * as path from 'path';


function convertIfc2ObjAndXml(source: string, objDestination: string, xmlDestination: string) {
  return new Promise((resolve, reject) => {
    const convertCmd = __dirname + '/IfcConvert-Ifc4';
    const convert2Obj = [source, objDestination];
    const convert2Xml = [source, xmlDestination];
    exec(convertCmd, convert2Obj, (err: any, data: any) => {
      console.log(err);
      console.log(data.toString());
    });

    exec(convertCmd, convert2Xml, (err: any, data: any) => {
      console.log(err);
      console.log(data.toString());
    });
  });
}
// TODO, check the whether the destination already exists
convertIfc2ObjAndXml(path.resolve(`${__dirname}/../data/Tausendpfund_4storeys.ifc`),
path.resolve(`${__dirname}/../data/example.obj`),
path.resolve(`${__dirname}/../data/example.xml`));