import { readFileSync, writeFileSync } from "node:fs";
import * as path from "node:path";

interface ReplaceInFilesOptions {
  directory: string;
  searchText: string;
  replacementText: string;
}
export function replaceInFiles(options: ReplaceInFilesOptions): void {
  const { directory, searchText, replacementText } = options;

  for (const filename of Deno.readDirSync(directory)) {
    if (filename.isFile) {
      const filepath = path.join(directory, filename.name);
      const contents = readFileSync(filepath, { encoding: "utf8" });
      const updatedContents = contents.replace(searchText, replacementText);
      writeFileSync(filepath, updatedContents, { encoding: "utf8" });
    } else if (filename.isDirectory) {
      replaceInFiles({
        directory: path.join(directory, filename.name),
        searchText,
        replacementText,
      });
    }
  }
}
