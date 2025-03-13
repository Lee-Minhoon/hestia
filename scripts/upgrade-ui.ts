import { execSync } from "child_process";
import { lstatSync, readdirSync, renameSync } from "fs";
import { join } from "path";

const dirPath = join(__dirname, "../src/components/ui");

const isTsx = (file: string) => file.endsWith(".tsx");

const components: {
  name: string;
  path: string;
}[] = [];

for (const file of readdirSync(dirPath)) {
  const path = join(dirPath, file);
  const stats = lstatSync(path);

  if (!stats.isDirectory() && isTsx(file)) {
    const fileName = file.replace(".tsx", "");
    components.push({ name: fileName, path });
    continue;
  }

  for (const innerFile of readdirSync(path)) {
    const innerFileName = innerFile.replace(".tsx", "");
    if (isTsx(innerFile) && innerFileName === file) {
      components.push({ name: innerFileName, path: join(path, innerFile) });
    }
  }
}

console.log(`🚀 Upgrading ${components.length} components...`);

for (const component of components) {
  try {
    execSync(`npx shadcn@latest add -y -o ${component.name}`, {
      stdio: "inherit",
    });

    const srcPath = join(dirPath, `${component.name}.tsx`);
    if (srcPath === component.path) {
      continue;
    }

    renameSync(srcPath, component.path);
  } catch {
    console.log(`No component found for ${component.name}`);
  }
}

console.log("✅ All components upgraded successfully!");
