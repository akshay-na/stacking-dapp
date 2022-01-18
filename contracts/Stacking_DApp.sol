// SPDX-License-Identifier: MIT

pragma solidity >=0.8.10;

import "./Tether_Token.sol";
import "./Dummy_Token.sol";

contract Stacking_Dapp {
  string public name = "Stacking Dapp";
  address public admin;
  Dummy public dummy_token;
  Tether public tether_dummy;

  address[] public stakers;

  mapping(address => uint256) public stackingBalance;
  mapping(address => bool) public hasStacked;
  mapping(address => bool) public isStacking;

  constructor(Dummy _dummyToken, Tether _tetherDummy) {
    dummy_token = _dummyToken;
    tether_dummy = _tetherDummy;
    admin = msg.sender;
  }

  modifier onlyAdmin() {
    require(msg.sender == admin, "Only admin can perform this action");
    _;
  }

  function stakeToken(uint256 _amount) public {
    require(_amount > 0, "Amount Cannot be Zero");

    tether_dummy.transferFrom(msg.sender, address(this), _amount);
    stackingBalance[msg.sender] = stackingBalance[msg.sender] + _amount;

    if (!hasStacked[msg.sender]) {
      stakers.push(msg.sender);
    }

    isStacking[msg.sender] = true;
    hasStacked[msg.sender] = true;
  }

  function unStakeToken() public {
    uint256 balance = stackingBalance[msg.sender];

    require(balance > 0, "Your stacking balance is zero");

    tether_dummy.transfer(msg.sender, balance);

    stackingBalance[msg.sender] = 0;
    isStacking[msg.sender] = false;
  }

  function issueDummyRewards() public onlyAdmin {
    for (uint256 i = 0; i < stakers.length; i++) {
      if (stackingBalance[stakers[i]] > 0) {
        dummy_token.transfer(stakers[i], stackingBalance[stakers[i]]);
      }
    }
  }
}
