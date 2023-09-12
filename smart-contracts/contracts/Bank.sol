// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract Bank {
    address payable contractOwner;
    mapping(address => uint256) bankBalances;

    constructor() payable {
        contractOwner = payable(msg.sender);
    }

    function sendToPlayer(address _address, uint256 amount) public payable {
        (payable(_address)).transfer(amount);
        bankBalances[msg.sender] -= amount;
    }

    function deposit(uint256 amount) public payable {
        require(msg.value == amount);
        bankBalances[msg.sender] += amount;
    }

    function getTotalBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getMyBalance() public view returns (uint256) {
        return bankBalances[msg.sender];
    }
}
