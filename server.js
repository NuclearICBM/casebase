const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'casebase'), { index: false }));
app.use((req, res, next) => {
  if (req.url === '/') {
    const fs = require('fs').promises;
    fs.readdir(path.join(__dirname, 'casebase')).then(files => {
      const dirs = files.filter(f => fs.statSync(path.join(__dirname, 'casebase', f)).isDirectory());
      res.send(`<ul>${dirs.map(d => `<li><a href="${d}/">${d}</a></li>`).join('')}</ul>`);
    }).catch(err => res.status(500).send(err.message));
  } else {
    next();
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));