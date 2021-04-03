import express from 'express';
import multer = require('multer');
import GLOBAL from '../global';
import convertIfc from '../ifc2obj_mtl';
import csv from 'csvtojson';
import path from 'path';

const specialKeys = [
  'sampleName',
  'obj',
  'mtl',
  'image'
];

const getProperAttributeTypeAndValue: (data: string) => {
  value: string | number;
  type: 'Nonquantitive' | 'Quantitive'
} = (data) => {
  const catchPercentageRegex = /^-?((\d)|([1-9]\d+))(\.(\d+))?%$/;

  if (typeof data === 'string' && data.match(catchPercentageRegex)) {
    return {
      type: 'Quantitive',
      value: +data.substring(0, data.length - 1)
    };
  }

  const type = isNaN(data as any) ? 'Nonquantitive' : 'Quantitive';
  return {
    type,
    value: type === 'Quantitive' ? +data : data
  };
};

// SET STORAGE
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, GLOBAL.filePath);
  },
  filename(_req, file, cb) {
    const fileName = `${Date.now()}.${file.fieldname}`;
    if (file.fieldname === 'csv') {
      csvFileName = fileName;
    } else {
      ifcFiles.push({
        convertedName: fileName,
      });
    }
    cb(null, fileName);
  },
});
const upload = multer({storage});
const uploadRouter = express.Router();
let ifcFiles: Array<{
  convertedName: string,
}> = [];
let csvFileName = '';
// @TODO csvValidationCheck should check whether the csv has the valid ifc-file-name column
// which we can use to match with correspond ifc file
const csvValidationCheck = (_req: any, _res: any, next: any) => {
  next();
};

const prepareMiddleware = (req: any, res: any, next: any) => {
  ifcFiles = [];
  next();
};

const handleFileStoreMiddleware = (req: any, res: any, next: any) => {
  const name = req.body.name;
  const description = req.body.description || '';
  const files: ArchitectureFile[] = [];
  // the rest time cost rely on converting
  let sum = 0;
  ifcFiles.forEach((ifc, index) => {
    convertIfc(ifc.convertedName, index).then(objAndMtl => {
      sum++;
      files.push({
        ...objAndMtl,
        ifcFileName: ifc.convertedName,
      } as any);
      // finished
      if (sum === ifcFiles.length) {
        (req as any).project = {};
        (req as any).project.files = files;
        (req as any).project.csvFileName = csvFileName;
        (req as any).project.name = name;
        (req as any).project.description = description;
        next();
      }
    });
  });
};

// tslint:disable-next-line:max-line-length
export const uploadMiddleware = [prepareMiddleware, upload.fields([{name: 'ifc'}, {name: 'csv'}]), csvValidationCheck, handleFileStoreMiddleware];
export const handleProjectDataMiddleware = (req: any, res: any, next: any) => {
  if (!req.project.csvFileName) {
    res.status(400).send({err: 'csv file name empty error'});
    return;
  }
  const csvPath = path.resolve('files/' + req.project.csvFileName);
  (csv().fromFile(csvPath).then(data => {

    if (data.length > 0 && [...new Set(data.map(d => d['sampleName']))].length !== data.length) {
      return Promise.reject('data is empty or format is not correct(each data item must contain unique sampleName)');
    }
    const sampleSize = data.length;

    // @TODO maybe also check other data item
    const variables = Object.keys(data[0]).filter(key => !specialKeys.includes(key)).map(attributeName => {
      return {
        name: attributeName,
        attributeType: getProperAttributeTypeAndValue(data[0][attributeName]).type
      };
    });

    req.project.sampleSize = sampleSize;
    req.project.variables = variables;

    // prepare the data
    const result = [];
    const sampleFiles = [];
    data.forEach((item, index) => {
      // sample files
      sampleFiles.push({
        sampleName: item['sampleName'],
        image: item['image'],
        obj: item['obj'],
        mtl: item['mtl']
      });

      const convertedItem = {
        sampleName: item['sampleName']
      } as any;
      variables.forEach(attribute => {
        convertedItem[attribute.name] = getProperAttributeTypeAndValue(item[attribute.name]).value;
      });
      result.push(convertedItem);
    });
    req.project.data = result;

    // prepare the sampleFiles
    req.project.sampleFiles = sampleFiles;

    next();
  }) as any).catch((e: any) => res.status(400).send({ err: e || 'csv file parse error' }));
};

// the following router is used for testing
uploadRouter.use('/', uploadMiddleware, handleProjectDataMiddleware, (req: any, res: any) => {
  res.send('ok');
});

export default uploadRouter;
