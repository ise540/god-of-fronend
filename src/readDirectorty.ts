import fs from 'fs';
import path from 'path';

const fsPromises = fs.promises;

export async function readDirectorty(pathName:string) {
    const allFileNames = await fsPromises.readdir(pathName)
  
    let promises: any = [];
  
    allFileNames.forEach((file) => {
      promises.push(
        fsPromises.readFile(path.join(__dirname, '..', 'storage', file))
      );
    });
  
    const result:Object = await Promise.all(promises).then(res => JSON.parse('[' + res.toString() + ']'))
    
    return result
  }
  