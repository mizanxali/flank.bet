const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther, formatEther } = require("ethers");

describe("Bank smart contract", function () {
  let Contract;
  let bank;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Contract = await ethers.getContractFactory("Bank");
    [owner, addr1, addr2] = await ethers.getSigners();

    bank = await Contract.deploy();
  });

  describe("bank transaction Tests", function () {
    it("get balance", async function () {
      const balance = await bank.getTotalBalance();
      console.log({ balance });
    });

    it("deposit money", async function () {
      await bank.deposit(parseEther("0.05"), { value: parseEther("0.05") });

      const balance = await bank.getTotalBalance();
      console.log({ balance });
    });

    it("send money to player", async function () {
      let addr1Balance = await ethers.provider.getBalance(addr1.address);
      console.log(formatEther(addr1Balance));

      await bank.deposit(parseEther("0.05"), { value: parseEther("0.05") });

      await bank.sendToPlayer(addr1.address, parseEther("0.03"));

      const balance = await bank.getTotalBalance();
      console.log({ balance });

      addr1Balance = await ethers.provider.getBalance(addr1.address);
      console.log(formatEther(addr1Balance));
    });
  });
});
