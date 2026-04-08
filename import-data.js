import fs from 'fs';
import http from 'http';
import path from 'path';

const filePath = './public/sample-accouchements.xlsx';

if (!fs.existsSync(filePath)) {
  console.error(`❌ Fichier non trouvé: ${filePath}`);
  process.exit(1);
}

const fileBuffer = fs.readFileSync(filePath);

// Build multipart form data
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const crlf = '\r\n';

let body = '';
body += `--${boundary}${crlf}`;
body += `Content-Disposition: form-data; name="file"; filename="sample-accouchements.xlsx"${crlf}`;
body += `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet${crlf}${crlf}`;

const bodyStart = Buffer.from(body);
const bodyEnd = Buffer.from(`${crlf}--${boundary}--`);
const finalBody = Buffer.concat([bodyStart, fileBuffer, bodyEnd]);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/accouchements/import',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': finalBody.length,
  },
};

console.log('📤 Envoi du fichier...');

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(responseData);
      console.log('✅ Réponse du serveur:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('✅ Réponse:', responseData);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Erreur:', err);
});

req.write(finalBody);
req.end();
