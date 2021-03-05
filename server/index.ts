import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { url } from 'inspector';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {
  // @ts-ignore
  const page: number = req.query.page || 1;
  const search: string = req.query.search as string|| "";

  const filteredTickets = tempData  
  .filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(search.toLowerCase()));
  
  const paginatedData = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const numOfPages=Math.ceil(filteredTickets.length/PAGE_SIZE);
  res.send({tickets : paginatedData,
            numOfPages: numOfPages});
});



app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

