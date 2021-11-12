const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const tourModel = require('../../models/tourModel');
const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const deleteAll = async () => {
  try {
    await tourModel.deleteMany();
    console.log('all record deleted successfully !');
  } catch (e) {
    console.log('error happens');
  }
  process.exit();
};

const insertData = async () => {
  try {
    await tourModel.insertMany(tours);
    console.log('all record deleted successfully !');
  } catch (e) {
    console.log('error happens');
  }
  process.exit();
};

if (process.argv[2] === '--delete') deleteAll();
if (process.argv[2] === '--fill') insertData();
