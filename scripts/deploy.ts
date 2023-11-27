
const { ethers } = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();
  const chat = await ethers.deployContract("MemeFT");
  console.log("MemeFT deployed to:", await chat.getAddress());
  console.log("MemeFT deployed by:", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
