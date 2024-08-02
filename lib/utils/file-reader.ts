import { promises as fs } from "fs";
import path from "path";

type TSXFile = {
  path: string;
  content: string;
}

async function* readFiles(dirname: string): AsyncGenerator<TSXFile> {
  const directoryEntries = await fs.readdir(dirname, { withFileTypes: true });

  for(const directoryEntry of directoryEntries) {
    const fullPath = path.join(dirname, directoryEntry.name);

    if(directoryEntry.isDirectory()) {
      yield* readFiles(fullPath);
    }

    if(directoryEntry.isFile() && directoryEntry.name.endsWith(".tsx")) {
      const content = await fs.readFile(fullPath, 'utf-8');
      yield { path: fullPath, content };
    }
  }
}

export async function processFiles(path: string) {
  const files: TSXFile[] = [];
  for await (const file of readFiles(path)) {
    files.push(file);
  }

  return files;
}
