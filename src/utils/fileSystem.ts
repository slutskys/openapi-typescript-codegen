import { copyFile as __copyFile, exists as __exists, readFile as __readFile, writeFile as __writeFile } from 'fs';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import { promisify } from 'util';
import prettier from 'prettier';

// Wrapped file system calls

export const readFile = promisify(__readFile);
const writeFileRaw = promisify(__writeFile);
export const copyFile = promisify(__copyFile);
export const exists = promisify(__exists);

type WriteFile = typeof writeFileRaw;

export const writeFile: WriteFile = async (path, data, options) => {
    let formattedData = data;

    if (typeof data === 'string' && typeof path === 'string') {
        const prettierConfig = await prettier.resolveConfig(path);
        formattedData = prettier.format(data, {
            ...prettierConfig,
            parser: 'typescript',
        });
    }

    return await writeFileRaw(path, formattedData, options);
};

// Re-export from mkdirp to make mocking easier
export const mkdir = mkdirp;

// Promisified version of rimraf
export const rmdir = (path: string): Promise<void> =>
    new Promise((resolve, reject) => {
        rimraf(path, (error: Error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
