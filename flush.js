require("dotenv").config();
const User3 = require("./models/user");
const { Deposit3, Withdrawal3, AuthPin3 } = require("./models/transaction");
const Notification3 = require("./models/notification");
const startDb = require("./models/index");

startDb();

async function Flush() {
  await Deposit3.deleteMany({}).exec();
  await Withdrawal3.deleteMany({}).exec();
  await Notification3.deleteMany({}).exec();
  await AuthPin3.deleteMany({}).exec();
  await User3.deleteMany({}).exec();
  console.log("\n\nDATABASE FLUSHED\n\n");
}

Flush();
