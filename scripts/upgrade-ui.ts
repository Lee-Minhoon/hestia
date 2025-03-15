import { execSync } from "child_process";
import {
  lstatSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "fs";
import { join } from "path";

const rootPath = join(__dirname, "../src/components/ui");

const isTsx = (file: string) => file.endsWith(".tsx");

// Shadcn always overwrites the file.
// If you want to keep your changes, add a comment "// backup" at the top of the file.
const shouldBackup = (path: string) => {
  try {
    const content = readFileSync(path, "utf-8");
    return content.startsWith("// backup");
  } catch {
    return false;
  }
};

const components: {
  name: string;
  path: string;
}[] = [];

for (const file of readdirSync(rootPath)) {
  const path = join(rootPath, file);
  const stats = lstatSync(path);

  if (!stats.isDirectory() && isTsx(file)) {
    const fileName = file.replace(".tsx", "");
    components.push({ name: fileName, path: rootPath });
    continue;
  }

  // Check if you moved the component to a subfolder.
  // There may be subfolders for the component due to reasons like test files, story files, or related components.
  for (const innerFile of readdirSync(path)) {
    const innerFileName = innerFile.replace(".tsx", "");
    if (isTsx(innerFile) && innerFileName === file) {
      components.push({ name: innerFileName, path });
    }
  }
}

console.log(`🚀 Upgrading ${components.length} components...`);

for (const component of components) {
  try {
    const srcPath = join(rootPath, `${component.name}.tsx`);
    const destPath = join(component.path, `${component.name}.tsx`);
    const backupPath = join(component.path, `${component.name}.bak.tsx`);
    const isBackupRequired = shouldBackup(destPath);

    // create a backup file before upgrading
    if (isBackupRequired) {
      renameSync(destPath, backupPath);
    }

    execSync(`npx shadcn@latest add -y -o ${component.name}`, {
      stdio: "inherit",
    });

    if (srcPath !== destPath) {
      renameSync(srcPath, destPath);
    }

    if (isBackupRequired) {
      const content = readFileSync(destPath, "utf-8");
      const updatedContent = `// backup\n\n${content}`;
      writeFileSync(destPath, updatedContent);
    }
  } catch {
    console.log(`No component found for ${component.name}`);
  }
}

console.log("✅ All components upgraded successfully!");
