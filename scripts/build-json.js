const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const blocksDir = path.join(__dirname, '..', 'blocks');
const outputFile = path.join(__dirname, '..', 'component-models.json');

if (!fs.existsSync(blocksDir)) {
  exit(1);
}

const componentModels = {};

function buildModel(blockPath, blockName) {
  const modelPath = path.join(blockPath, 'model.json');
  if (!fs.existsSync(modelPath)) {
    return;
  }

  let model;
  try {
    const rawModel = fs.readFileSync(modelPath, 'utf8');
    model = JSON.parse(rawModel);
  } catch (e) {
    return;
  }

  // Basic validation
  if (!model.$schema || !model.name) {
    return;
  }

  componentModels[blockName] = model;
}

// Scan blocks
fs.readdirSync(blocksDir).forEach((blockName) => {
  const blockPath = path.join(blocksDir, blockName);
  if (fs.statSync(blockPath).isDirectory()) {
    buildModel(blockPath, blockName);
  }
});

// Write output
try {
  fs.writeFileSync(outputFile, JSON.stringify(componentModels, null, 2));
} catch (e) {
  exit(1);
}
