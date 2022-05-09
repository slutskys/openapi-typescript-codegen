import {
    copyFile as __copyFile,
    exists as __exists,
    mkdir as __mkdir,
    readFile as __readFile,
    rm as __rm,
    writeFile as __writeFile,
} from 'fs';
import { promisify } from 'util';

// Wrapped file system calls

export const readFile = promisify(__readFile);
const writeFileRaw = promisify(__writeFile);
export const copyFile = promisify(__copyFile);
export const exists = promisify(__exists);

type WriteFile = typeof writeFileRaw;

export const writeFile: WriteFile = async (path, data, options) => {
    let formattedData: string | NodeJS.ArrayBufferView;

    if (typeof data === 'string' && typeof path === 'string') {
        try {
            const prettier = require('prettier');
            const prettierConfig = await prettier.resolveConfig(path);
            formattedData = prettier.format(data, {
                ...prettierConfig,
                parser: 'typescript',
            });
        } catch (err) {
            formattedData = data;
        }
    } else {
        formattedData = data;
    }

    return await writeFileRaw(path, formattedData, options);
};

export const mkdir = (path: string): Promise<void> =>
    new Promise((resolve, reject) => {
        __mkdir(
            path,
            {
                recursive: true,
            },
            error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });

export const rmdir = (path: string): Promise<void> =>
    new Promise((resolve, reject) => {
        __rm(
            path,
            {
                recursive: true,
                force: true,
            },
            error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
