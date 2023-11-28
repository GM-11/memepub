"use client";

import Image from "next/image";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { ethers, BrowserProvider } from "ethers";

import MemeFT from "../artifacts/contracts/MemeFT.sol/MemeFT.json";
import MemeData from "../artifacts/contracts/MemeData.sol/MemeData.json";
import Link from "next/link";

function Home() {
  const [fileImg, setFileImg] = useState("");
  const [provider, setProvider] = useState<BrowserProvider>();
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState<ethers.Signer>();
  const [memes, setMemes] = useState<any[]>([]);

  const memeDataContractAddress = "0xd48eaa40afF70bCdd0fc478b2FB4Db36D696efcE";
  const memeFTContractAddress = "0xaf97C6AC6F97Db15da6b746955C8bd67E3f719C0";

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

  async function loadMemes() {
    try {
      const dataContract = new ethers.Contract(
        memeDataContractAddress!,
        MemeData.abi,
        signer
      );

      const data = await dataContract.getAllMemes();

      setMemes(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadProvider();
  }, []);

  useEffect(() => {
    loadMemes();
  });

  return (
    <div>
      <p>
        Your address: <strong>{address}</strong>
      </p>

      <Link href="/postMeme">Post Meme</Link>

      {memes.map((meme) => {
        return (
          <div key={meme[0]}>
            {/* <img
              src={`https://gateway.pinata.cloud/ipfs/${meme[2]}`}
              width={200}
              height={200}
              alt=""
            /> */}
            <p>{`${meme}`}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
