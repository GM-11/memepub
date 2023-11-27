import Image from "next/image";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { ethers, BrowserProvider } from "ethers";

function Home() {
  const [fileImg, setFileImg] = useState("");
  const [provider, setProvider] = useState<BrowserProvider>();
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState<ethers.Signer>();

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

  async function sendFileToIPFS() {
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

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(ImgHash);
      } catch (error) {
        console.log("Error sending File to IPFS: ", error);
      }
    }
  }

  useEffect(() => {
    loadProvider();
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

      <Image src={fileImg} alt="img" />

      <button onClick={sendFileToIPFS}>Mint NFT</button>
    </div>
  );
}

export default Home;
