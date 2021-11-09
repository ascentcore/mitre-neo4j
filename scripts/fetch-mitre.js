const fs = require('fs');
const path = require('path');
const https = require('https');

const fetchFileFromUrl = (url, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    });
  });
};

fs.mkdirSync(path.join(__dirname, '../data'));
fetchFileFromUrl(
  'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json', 
  path.join(__dirname, '..', 'data', 'mitre-attack.json'),
).then(() => {});