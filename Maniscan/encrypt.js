var encryptor = require('file-encryptor');
var fs = require('fs');
var path = require('path');

var key = 'maniscan';
var folderPath = 'motors';

fs.readdir(folderPath, function(err, files) {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  files.forEach(function(file) {
    var filePath = path.join(folderPath, file);
    var encryptedFilePath = path.join(folderPath, 'encrypted_' + file);

    encryptor.encryptFile(filePath, encryptedFilePath, key, function(err) {
      if (err) {
        console.error('Encryption error for file', file, ':', err);
      } else {
        console.log('Encryption complete for file', file);

        fs.unlink(filePath, function(err) {
          if (err) {
            console.error('Error deleting original file', file, ':', err);
          } else {
            console.log('Original file', file, 'deleted.');
          }
        });
      }
    });
  });
});
