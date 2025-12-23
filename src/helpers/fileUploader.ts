import { existsSync, mkdir, mkdirSync, rename } from 'fs';
import { diskStorage } from 'multer';
import { relative } from 'path';

export const getMulterOptions = (relativePath: string = '') => ({
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },

  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      const storagePath = process.cwd() + '/storage/';
      const splittedRelativePath = relativePath.split('/');

      let incrementalPath = storagePath;

      if (!existsSync(storagePath + relativePath.concat('/'))) {
        splittedRelativePath.forEach((folder) => {
          if (!existsSync(incrementalPath + folder)) {
            mkdirSync(incrementalPath + folder);
          }

          incrementalPath += folder + '/';
        });
      } else {
        incrementalPath += relativePath.concat('/');
      }
      cb(null, incrementalPath);
    },
    filename: (_req: any, file: any, cb: any) => {
      cb(null, Math.ceil(Math.random() * 100000) + '_' + file.originalname);
    },
  }),
});

export const renameUploadedFile = (filename: string, directory: string) => {
  const updatedFileName = changeFilenameSafe(filename);
  rename(directory + filename, directory + updatedFileName, (err) => {
    if (err) {
      console.error('Error while renaming file:', err);
    } else {
      console.log('File renamed successfully to', updatedFileName);
    }
  });
  return updatedFileName;
};

const changeFilenameSafe = (originalName: string) => {
  return (
    new Date().valueOf() +
    '_' +
    originalName.replace(/\s/, '_').replace(/[^a-zA-Z0-9_\.-]/, '')
  );
};
