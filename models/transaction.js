var mongoose = require("mongoose");
var { nanoid } = require("nanoid");

function genCode() {
  return nanoid(16);
}

const depositSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  ref: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  amount: { type: Number, min: 0 },
  description: String,
  details: String,
  approved: { type: Boolean, default: false },
  client: { type: mongoose.Types.ObjectId, ref: "User3" },
  walletType: { type: String, required: true },
  walletAdrress: { type: String, required: true, min: 24 },
});

const withdrawalSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  ref: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    unique: true,
  },
  amount: { type: Number, min: 0 },
  approved: { type: Boolean, default: false },
  walletType: { type: String, required: true },
  details: String,
  pin: String,
  client: { type: mongoose.Types.ObjectId, ref: "User3" },
  walletAdrress: { type: String, required: true, min: 24 },
});

const authPinSchema = mongoose.Schema({
  pin: {
    type: String,
    unique: true,
    minLength: 4,
    default: genCode,
  },
  client: { type: mongoose.Types.ObjectId, ref: "User3" },
  dateCreated: { type: Date, default: Date.now },
  hasBeenUsed: { type: Boolean, default: false },
  withdrawal: {
    type: mongoose.Types.ObjectId,
    ref: "Withdrawal3",
    unique: true,
  },
});

const Deposit3 = mongoose.model("Deposit3", depositSchema);
const Withdrawal3 = mongoose.model("Withdrawal3", withdrawalSchema);
const AuthPin3 = mongoose.model("AuthPin3", authPinSchema);

module.exports = {
  Deposit3,
  Withdrawal3,
  AuthPin3,
};
