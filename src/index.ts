import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getRandomHealth } from './getRandomHealth';
import { readDirectorty } from './readDirectorty';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

app.get('/monsters', (req, res) => {
  readDirectorty(path.join(__dirname, '..', 'storage')).then((response) =>
    res.send(response)
  );
});

app.post('/spawn', (req, res) => {
  const monster = {
    name: req.body.name,
    id: uuidv4(),
    hp: getRandomHealth(10, 100)
  };

  fs.writeFile(
    path.join(__dirname, '..', 'storage', `${monster.id}.json`),
    JSON.stringify(monster),
    (err) => {
      if (err) console.log(err);
      res.send(monster);
    }
  );
});

app.put('/hit', (req, res) => {
  const currentMonsterPath = path.join(
    __dirname,
    '..',
    'storage',
    `${req.body.id}.json`
  );
  fs.readFile(currentMonsterPath, (err, data) => {
    if (err) return res.send({ error: 'no such monster' });

    const monster = JSON.parse(data.toString());

    monster.hp -= getRandomHealth(10, 50);

    if (monster.hp < 1) {
      fs.rm(currentMonsterPath, (err) => {
        if (err) console.log(err);
        return;
      });
      res.send({ status: 'monster defeated' });
    } else {
      fs.writeFile(currentMonsterPath, JSON.stringify(monster), (err) => {
        if (err) console.log(err);
        return;
      });
      res.send(monster);
    }
  });
});

startServer();
