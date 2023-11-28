// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MemeData {
    struct Meme {
        uint256 id;
        string name;
        string IPFSuri;
        uint256 price;
        address owner;
    }

    mapping(uint256 => Meme) memes;

    uint256 private _memeIdCounter;

    function createMeme(
        string memory name,
        string memory IPFSuri
    ) public returns (uint256) {
        uint256 memeId = _memeIdCounter;
        memes[memeId] = Meme(memeId, name, IPFSuri, 0, msg.sender);

        _memeIdCounter += 1;

        return memeId;
    }

    function getAllMemes() public view returns (Meme[] memory) {
        Meme[] memory memeList = new Meme[](_memeIdCounter);

        for (uint256 i = 0; i < _memeIdCounter; i++) {
            memeList[i] = memes[i];
        }

        return memeList;
    }

    function getMeme(uint256 memeId) public view returns (Meme memory) {
        return memes[memeId];
    }
}
