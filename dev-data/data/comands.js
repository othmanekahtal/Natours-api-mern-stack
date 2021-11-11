const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const tourModel = require('../../models/tourModel');
const fs = require('fs');
const tours = () => fs.readFile('tours.json', 'utf-8');
const deleteAll = async () => tourModel.deleteMany();
const insertData = async () => {
  await tourModel.insertMany(tours);
};
if (process.argv[2] === '--delete') deleteAll().then(() => console.log('all record deleted successfully !')).catch(() => console.log('error happens'));
if (process.argv[2] === 'fill') insertData().then(() => console.log('all record inserted successfully !')).catch(() => console.log('error happens'));
