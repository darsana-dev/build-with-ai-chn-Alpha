const fs = require('fs');
const https = require('https');

// Create dummy exe
fs.writeFileSync('demo-payload.exe', 'MZ90... this is a dummy executable file mimicking malware for the file scanner.');

// Download QR code
const file = fs.createWriteStream('demo-qr.png');
https.get('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://test-malware.com', function(response) {
  response.pipe(file);
});
