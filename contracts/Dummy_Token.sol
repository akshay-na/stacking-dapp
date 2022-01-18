// SPDX-License-Identifier: MIT

pragma solidity >=0.8.10;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dummy is ERC20 {
  constructor() ERC20("Dummy Token", "DTN") {
    _mint(msg.sender, 100000 * 10**18);
  }
}
