const API_KEY = process.env.ALCHEMY_API_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(`https://polygon-mumbai.g.alchemy.com/v2/${API_KEY}`);
const contract = require("../artifacts/contracts/MemeFT.sol/MemeFT.json");

console.log(JSON.stringify(contract.abi));


