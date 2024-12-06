/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const fs1 = require('fs');
const path1 = require('path');
const cors = require('cors');

const app = express();
// Enable CORS for all routes
app.use(cors());
// Serve static files from the "assets" folder
app.use('/assets', express.static(path1.join(__dirname, 'src/assets')));


const LTR_FOLDER = path1.join(__dirname, 'src/assets/images/background/ltr_backgrd');
const RTL_FOLDER = path1.join(__dirname, 'src/assets/images/background/rtl_backgrd');

console.log(RTL_FOLDER);
console.log(LTR_FOLDER);

app.get('/api/images/:direction', (req, res) => {
  const direction = req.params.direction === 'rtl' ? 'rtl' : 'ltr';
  const folderPath = direction === 'ltr' ? LTR_FOLDER : RTL_FOLDER;
 
  console.log(`Trying to read images from folder: ${folderPath}`); // Log folder path

  fs1.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err); // Log the error to the console
      return res.status(500).send({ error: 'Unable to read folder' });
    }

    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) // Only return image files
      .map(file => `http://localhost:3000/assets/images/background/${direction}_backgrd/${file}`); // Adjust path for frontend access
      
    console.log('Found images:', images); // Log found images
    res.json(images);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
