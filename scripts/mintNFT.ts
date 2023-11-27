const API_KEY = process.env.ALCHEMY_API_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(`https://polygon-mumbai.g.alchemy.com/v2/${API_KEY}`);
const contract = require("../artifacts/contracts/MemeFT.sol/MemeFT.json");

const contractAddress = process.env.CONTRACT_ADDRESS;
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI: string) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx: any) => {

        web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
            function (err: Error, hash: string) {
                if (!err) {
                    console.log(
                        "The hash of your transaction is: ",
                        hash,
                        "\nCheck Alchemy's Mempool to view the status of your transaction!"
                    );
                } else {
                    console.log(
                        "Something went wrong when submitting your transaction:",
                        err
                    );
                }
            }
        );
    }).catch((err: Error) => {
        console.log(" Promise failed:", err);
    });
}
