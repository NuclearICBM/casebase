const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = process.env.PORT || 3000;

// Use the correct path to casebase
const casebasePath = path.join(__dirname, 'casebase');
app.use(express.static(casebasePath, { index: false }));

app.get('/', async (req, res) => {
  try {
    const files = await fs.readdir(casebasePath);
    const directories = (await Promise.all(files.map(async (file) => {
      const stat = await fs.stat(path.join(casebasePath, file));
      return stat.isDirectory() ? file : null;
    }))).filter(dir => dir !== null);
    res.send(`<ul>${directories.map(dir => `<li><a href="${dir}/">${dir}</a></li>`).join('')}</ul>`);
  } catch (err) {
    console.error('Directory read error:', err);
    res.status(500).send('Error listing directories: ' + err.message);
  }
});

app.get('/:dir/case.xml', (req, res) => {
  const filePath = path.join(casebasePath, req.params.dir, 'case.xml');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('File send error:', err);
      res.status(404).send('File not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Casebase service running on port ${port}`);
});