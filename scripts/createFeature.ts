import fs from "fs";
import path from "path";

console.log("🚀 Starting multi-feature creation...");

const featureNames = process.argv.slice(2);

if (featureNames.length === 0) {
  console.error("❌ Please provide one or more feature names, e.g. npx tsx scripts/createFeature.ts equipment employee");
  process.exit(1);
}

const templatePath = path.resolve("src/features/_templateFeature");

if (!fs.existsSync(templatePath)) {
  console.error("❌ _templateFeature folder not found in src/features/");
  process.exit(1);
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

function copyDir(src: string, dest: string, featureName: string) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);

    // 🧠 Replace _templateFeature in file/folder names
    const featureNameCapitalized = capitalize(featureName);
    const destName = entry.name
      .replace(/_templateFeature/g, featureName)
      .replace(/Equipment/g, featureNameCapitalized);
    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, featureName);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");

      // 🪄 Replace inside file content
      content = content
        .replace(/_templateFeature/g, featureName)
        .replace(/Equipment/g, featureNameCapitalized);

      fs.writeFileSync(destPath, content, "utf8");
    }
  }
}

for (const featureName of featureNames) {
  const newFeaturePath = path.resolve(`src/features/${featureName}`);

  if (fs.existsSync(newFeaturePath)) {
    console.warn(`⚠️ Feature '${featureName}' already exists. Skipping...`);
    continue;
  }

  copyDir(templatePath, newFeaturePath, featureName);
  console.log(`✅ Feature '${featureName}' created successfully from _templateFeature!`);
}

console.log("🎉 All features processed!");
