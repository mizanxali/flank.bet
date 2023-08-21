const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Betting smart contract", function () {
  let Contract;
  let betting;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Contract = await ethers.getContractFactory("Betting");
    [owner, addr1, addr2] = await ethers.getSigners();

    betting = await Contract.deploy();
  });

  describe("Deployment Tests", function () {
    it("Should set the right owner", async function () {
      expect(await betting.owner()).to.equal(owner.address);
    });
  });

  describe("Betting ransaction Tests", function () {
    it("Should create a new question and return the total number of questions", async function () {
      await betting.createQuestion(
        "1234567",
        "Who will win this match?",
        "Yes",
        "No"
      );

      const questionsLength = await betting.getQuestionsLength();
      expect(Number(questionsLength)).to.equal(1);
    });
    it("Should create a new bet", async function () {
      await betting.createQuestion(
        "1234567",
        "Who will win this match?",
        "Yes",
        "No"
      );

      await betting.createQuestion(
        "9812782",
        "Who will win this match 2?",
        "ok",
        "nah fam"
      );

      const questionIndex = await betting.getQuestionsLength();

      await betting.createBet(Number(questionIndex) - 2, true, {
        value: ethers.parseEther("1.0"),
      });
      await betting.createBet(Number(questionIndex) - 1, false, {
        value: ethers.parseEther("1.0"),
      });

      const betsLength = await betting.getBetsLength();
      expect(Number(betsLength)).to.equal(2);

      const myBets = await betting.getMyBets();
      expect(myBets.length).to.equal(2);
    });
    //     it("Should transfer tokens between accounts", async function () {
    //       //transfer 50 tokens from owner to addr1
    //       await bet.transfer(addr1.address, 50);
    //       const addr1Balance = await bet.balanceOf(addr1.address);
    //       expect(addr1Balance).to.equal(50);
    //       //transfer 50 tokens from addr1 to addr2
    //       await bet.connect(addr1).transfer(addr2.address, 50);
    //       const addr2Balance = await bet.balanceOf(addr2.address);
    //       expect(addr2Balance).to.equal(50);
    //     });
    //     it("Should fail if sender doesn't have enough tokens", async function () {
    //       const initialOwnerBalance = await bet.balanceOf(owner.address);
    //       //try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens)
    //       await expect(
    //         bet.connect(addr1).transfer(owner.address, 1)
    //       ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    //       //owner balance shouldn't have changed
    //       expect(await bet.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    //     });
    //     it("Should update balances after transfers", async function () {
    //       const initialOwnerBalance = await bet.balanceOf(owner.address);
    //       //transfer 100 tokens from owner to addr1
    //       await bet.transfer(addr1.address, 100);
    //       //transfer another 50 tokens from owner to addr2
    //       await bet.transfer(addr2.address, 50);
    //       //check balances
    //       const finalOwnerBalance = await bet.balanceOf(owner.address);
    //       expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
    //       const addr1Balance = await bet.balanceOf(addr1.address);
    //       expect(addr1Balance).to.equal(100);
    //       const addr2Balance = await bet.balanceOf(addr2.address);
    //       expect(addr2Balance).to.equal(50);
    //     });
  });
});
