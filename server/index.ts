import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { url } from 'inspector';
import { Ticket } from '../client/src/api';
import { fstat, writeFile } from 'fs';

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
  let search: string = req.query.search as string || "";
  let mode: string = '';
  let filteredTickets: Ticket[] = [];
  let date: number=0;
  let userEmail:string='';
  //create another api
  if (search.startsWith("after:") || search.startsWith("before:")) {
    mode = search.startsWith("after:") ? 'after' : 'before';
    const tempDate = search.slice(search.indexOf(":") + 1, search.indexOf(" "));
    date = new Date(tempDate).getTime();
    search = search.split(" ")[1];
  }
  if (search.startsWith("from")){
    mode='from';
    userEmail=search.slice(search.indexOf(":") + 1, search.indexOf(" "));
    search = search.split(" ")[1];
  }

  filteredTickets = tempData.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(search.toLowerCase()));
  switch (mode) {
    case 'after':
      filteredTickets = filteredTickets.filter((t) => (date <= t.creationTime));
      break;
    case 'before':
      filteredTickets = filteredTickets.filter((t) => (date >= t.creationTime));
      break;
    case 'from':
      filteredTickets = filteredTickets.filter((t) => (userEmail === t.userEmail));
      break;
  }


  const paginatedData = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const numOfPages = Math.ceil(filteredTickets.length / PAGE_SIZE);
  res.send({
    tickets: paginatedData,
    numOfPages: numOfPages
  });
});

app.post(APIPath+'/addTicket',(req,res)=>{
  const ticket:Ticket = req.body.params.ticket
  tempData.unshift(ticket)
  updateJson();
  // @ts-ignore
  const page: number = req.body.page || 1;
  const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const numOfPages = Math.ceil(tempData.length / PAGE_SIZE);
  res.send({
    tickets: paginatedData,
    numOfPages: tempData.length
  });
})

function updateJson()
{
  const dataAsString:string=JSON.stringify(tempData,null,2);
  console.log('---dataAsString', dataAsString);
  
  writeFile('./data.json',dataAsString,(err:any)=>{
    if (err) console.log(err); 
  })
  // updateTempData();
}

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

