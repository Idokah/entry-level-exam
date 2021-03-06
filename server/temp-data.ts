import {Ticket} from '../client/src/api';

export const  dataPath = '../db/data.json';
const data = require(dataPath);

export const tempData = data as Ticket[];
