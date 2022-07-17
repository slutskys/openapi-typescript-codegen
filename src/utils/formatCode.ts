import { EOL } from 'os';
import { cwd } from 'process';

export const formatCode = (s: string): string => {
    let indent: number = 0;
    let lines = s.split(EOL);
    lines = lines.map(line => {
        line = line.trim().replace(/^\*/g, ' *');
        let i = indent;
        if (line.endsWith('(') || line.endsWith('{') || line.endsWith('[')) {
            indent++;
        }
        if ((line.startsWith(')') || line.startsWith('}') || line.startsWith(']')) && i) {
            indent--;
            i--;
        }
        const result = `${'\t'.repeat(i)}${line}`;
        if (result.trim() === '') {
            return '';
        }
        return result;
    });
    const raw = lines.join(EOL);

    try {
        const prettier = require('prettier');
        // sync, so that this function doesn't have to return a promise
        const prettierConfig = prettier.resolveConifg.sync(cwd());
        return prettier.format(raw, {
            ...(prettierConfig ?? {}),
            parser: 'typescript',
        });
    } catch (err) {
        return raw;
    }
};
