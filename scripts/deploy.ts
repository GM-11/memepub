
const { ethers } = require("hardhat");

async function main() {
  const memeFT = await ethers.deployContract("MemeFT");
  const memeData = await ethers.deployContract("MemeData");
  console.log("MemeFT deployed to:", await memeFT.getAddress());
  console.log("MemeData deployed to:", await memeData.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
