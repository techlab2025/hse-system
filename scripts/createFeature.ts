import fs from "fs";
import path from "path";

console.log("🚀 Starting feature creation...");

const featureName = process.argv[2];

if (!featureName) {
  console.error("❌ Please provide a feature name, e.g. npx tsx scripts/createFeature.ts equipment");
  process.exit(1);
}

const templatePath = path.resolve("src/features/_templateFeature");
const newFeaturePath = path.resolve(`src/features/${featureName}`);

if (!fs.existsSync(templatePath)) {
  console.error("❌ _templateFeature folder not found in src/features/");
  process.exit(1);
}

if (fs.existsSync(newFeaturePath)) {
  console.error(`⚠️ Feature '${featureName}' already exists.`);
  process.exit(1);
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const featureNameCapitalized = capitalize(featureName);

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    let destName = entry.name.replace(/Equipment/g, featureNameCapitalized);
    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");
      content = content
        .replace(/_templateFeature/g, featureName)
        .replace(/Equipment/g, featureNameCapitalized);
      fs.writeFileSync(destPath, content, "utf8");
    }
  }
}

copyDir(templatePath, newFeaturePath);

console.log(`✅ Feature '${featureName}' created successfully from _templateFeature!`);

