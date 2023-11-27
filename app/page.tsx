import Image from "next/image";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { ethers, BrowserProvider } from "ethers";

import MemeFT from "../artifacts/contracts/MemeFT.sol/MemeFT.json";
import MemeData from "../artifacts/contracts/MemeData.sol/MemeData.json";

function Home() {
  const [fileImg, setFileImg] = useState("");
  const [nftName, setNftName] = useState("");
  const [provider, setProvider] = useState<BrowserProvider>();
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState<ethers.Signer>();
  const [nfts, setNfts] = useState<any[]>([]);

  const memeDataContractAddress = process.env.MEME_DATA_CONTRACT_ADDRESS;
  const memeFTContractAddress = process.env.MEME_FT_CONTRACT_ADDRESS;

  async function loadProvider() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    if (provider) {
      console.log("Ethereum successfully detected!");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const signer = await provider.getSigner();

      setAddress(accounts[0]);
      setProvider(provider);
      setSigner(signer);
    } else {
      console.log("Please install MetaMask!");
    }
  }

  async function loadNFTS() {
    const dataContract = new ethers.Contract(
      memeDataContractAddress!,
      MemeData.abi,
      provider
    );

    const data = await dataContract.getMemes();

    setNfts(data);
  }

  async function sendFileToIPFS(): Promise<string | undefined> {
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `${process.env.PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.PINATA_SECRET}`,
            "Content-Type": "multipart/form-data",
          },
        });

        return `ipfs://${resFile.data.IpfsHash}`;
      } catch (error) {
        return "wrong";
      }
    }
  }

  async function mintNFT() {
    const memeDataContract = new ethers.Contract(
      memeDataContractAddress!,
      MemeData.abi,
      signer
    );

    const memeFTContract = new ethers.Contract(
      memeFTContractAddress!,
      MemeFT.abi,
      signer
    );

    const ipfsHash = await sendFileToIPFS();

    await memeFTContract.mintNFT(address, ipfsHash);
    await memeDataContract.createMeme(nftName, address, ethers.toBigInt(1));
  }

  useEffect(() => {
    loadProvider();
    // loadNFTS();

  }, []);

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files![0];
          setFileImg(URL.createObjectURL(file));
        }}
      />

      <br />
      <input
        type="text"
        onChange={(e) => {
          setNftName(e.target.value);
        }}
      />

      <Image src={fileImg} alt="img" />

      <button onClick={mintNFT}>Mint NFT</button>
    </div>
  );
}

export default Home;
