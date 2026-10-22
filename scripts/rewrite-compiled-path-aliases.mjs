import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const compiledSourceDirectory = path.resolve('dist');
const pathAliasTargets = new Map([
  ['@auth', 'modules/auth'],
  ['@config', 'config'],
  ['@generated', 'generated'],
  ['@infra', 'infra'],
  ['@shared', 'shared'],
]);

async function listCompiledFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);

      return entry.isDirectory() ? listCompiledFiles(entryPath) : [entryPath];
    }),
  );

  return nestedFiles.flat();
}

function rewritePathAlias(specifier, compiledFilePath) {
  for (const [pathAlias, targetDirectory] of pathAliasTargets) {
    if (specifier !== pathAlias && !specifier.startsWith(`${pathAlias}/`)) {
      continue;
    }

    const aliasSuffix = specifier.slice(pathAlias.length).replace(/^\//, '');
    const absoluteTarget = path.join(
      compiledSourceDirectory,
      targetDirectory,
      aliasSuffix,
    );
    let relativeTarget = path
      .relative(path.dirname(compiledFilePath), absoluteTarget)
      .replaceAll(path.sep, '/');

    if (!relativeTarget.startsWith('.')) {
      relativeTarget = `./${relativeTarget}`;
    }

    return relativeTarget;
  }

  return specifier;
}

for (const compiledFilePath of await listCompiledFiles(compiledSourceDirectory)) {
  if (!compiledFilePath.endsWith('.js') && !compiledFilePath.endsWith('.d.ts')) {
    continue;
  }

  const originalContents = await readFile(compiledFilePath, 'utf8');
  const rewrittenContents = originalContents.replace(
    /(["'])(@(auth|config|generated|infra|shared)(?:\/[^"']*)?)\1/g,
    (matchedSpecifier, quote, specifier) =>
      `${quote}${rewritePathAlias(specifier, compiledFilePath)}${quote}`,
  );

  if (rewrittenContents !== originalContents) {
    await writeFile(compiledFilePath, rewrittenContents);
  }
}
