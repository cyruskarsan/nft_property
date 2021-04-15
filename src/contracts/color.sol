// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721{
    string[] public colors;

    //hashtable
    mapping(string => bool) _colorExists;
    constructor() ERC721("Color", "CLR") {}
    //mint a color and restrict access to everyone (should restrict to owner in prod)
    function mint(string memory _color) public {
        // Require unique color
        require(!_colorExists[_color], "unique color required");
        colors.push(_color);
        uint _id = colors.length -1;
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
    }

    function totalSupply() public view returns(uint) {
        return colors.length;
    }
}

