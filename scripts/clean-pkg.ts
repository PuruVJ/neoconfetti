import fsp from 'fs/promises';
import pkg from '../package/package.json';

// Stuff to remove
const { devDependencies, ...targetPkgJson } = pkg;

fsp.writeFile('../package/package.json', JSON.stringify(targetPkgJson, null, 2));
