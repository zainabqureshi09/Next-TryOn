const fs = require('fs');
const path = require('path');
const https = require('https');

const modelsDir = path.join(__dirname, '../public/models');

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Models to download
const modelFiles = [
  // TinyFaceDetector
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  
  // FaceLandmark68
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1'
];

// Base URL for models
const baseUrl = 'https://github.com/justadudewhohacks/face-api.js/raw/master/weights/';

// Download each model
modelFiles.forEach(file => {
  const url = baseUrl + file;
  const filePath = path.join(modelsDir, file);
  
  console.log(`Downloading ${file}...`);
  
  const fileStream = fs.createWriteStream(filePath);
  https.get(url, response => {
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded ${file}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {}); // Delete the file if there's an error
    console.error(`Error downloading ${file}: ${err.message}`);
  });
});