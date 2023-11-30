"use client";

import Image from "next/image";
import fs from "fs";
import React, { useEffect, useState } from "react";
import { ethers, BrowserProvider } from "ethers";
import pinataSdk, { PinataPinOptions } from "@pinata/sdk";
import MemeFT from "../../artifacts/contracts/MemeFT.sol/MemeFT.json";
import MemeData from "../../artifacts/contracts/MemeData.sol/MemeData.json";

function Home() {
  const [fileImg, setFileImg] = useState("");
  const [fileName, setfileName] = useState("");
  const [provider, setProvider] = useState<BrowserProvider>();
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState<ethers.Signer>();

  const pinata = new pinataSdk({
    pinataApiKey: "2cac5fc75dcd629e0c31",
    pinataSecretApiKey:
      "fe6587cd58f8b26c96b0b857b3ccbcd4cdf90e3658c3a6a13529403ab9481ce4",
  });

  const memeDataContractAddress = "0xd48eaa40afF70bCdd0fc478b2FB4Db36D696efcE";
  const memeFTContractAddress = "0xaf97C6AC6F97Db15da6b746955C8bd67E3f719C0";

  async function loadProvider() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    if (provider) {
      console.log("Ethereum successfully detected!");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      setProvider(provider);
    } else {
      console.log("Please install MetaMask!");
    }
  }

  async function sendFileToIPFS(): Promise<string | undefined> {
    if (fileImg) {
      try {
        // const formData = new FormData();
        // formData.append("file", fileImg);
        const readableStreamForFile = fs.createReadStream(fileImg);
        const result = await pinata.pinFileToIPFS(readableStreamForFile, {
          pinataMetadata: {
            name: fileName,
            keyvalues: "customKey",
          },
          pinataOptions: {
            cidVersion: 0,
          },
        });

        return result.IpfsHash;
      } catch (error) {
        console.log(error);
        return "wrong";
      }
    }
  }

  async function postMeme() {
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

    if (ipfsHash === "wrong") {
      return;
    }

    await memeDataContract.createMeme(fileName, ipfsHash);
  }

  useEffect(() => {
    loadProvider();
  }, []);

  return (
    <div>
      <p>
        Your address: <strong>{address}</strong>
      </p>
      <form
        encType="multipart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
          postMeme();
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files![0];
            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
              setFileImg(reader.result as string);
            };

            reader.onerror = function (error) {
              console.log("Error: ", error);
            };
          }}
        />

        <br />
        <input
          type="text"
          onChange={(e) => {
            setfileName(e.target.value);
          }}
        />

        <Image src={fileImg} alt="img" width={200} height={200} />

        <button type="submit">Post Meme</button>
      </form>{" "}
    </div>
  );
}

export default Home;
