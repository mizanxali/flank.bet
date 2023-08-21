// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./ATM.sol";

contract bet is ATM, Ownable {
    // event NewBet(address addy, uint amount, Team teamBet);

    struct Bet {
        address bettorAddress;
        uint amount;
        Question question;
        Option selectedOption;
    }

    struct Question {
        string id;
        string title;
        Option primaryOption;
        Option secondaryOption;
        uint totalBetMoney;
    }

    struct Option {
        string title;
        uint totalBetAmount;
    }

    Bet[] public bets;
    Question[] public questions;

    // struct Bet {
    //     string name;
    //     address addy;
    //     uint amount;
    //     Team teamBet;
    // }

    // struct Team {
    //     string name;
    //     uint totalBetAmount;
    // }

    // Bet[] public bets;
    // Team[] public teams;

    address payable contractOwner;

    // uint public totalBetMoney = 0;

    // mapping(address => uint) public numBetsAddress;

    constructor() payable {
        contractOwner = payable(msg.sender);
        // teams.push(Team("team1", 0));
        // teams.push(Team("team2", 0));
    }

    // function createTeam(string memory _name) public {
    //     teams.push(Team(_name, 0));
    // }

    // function getTotalBetAmount(uint _teamId) public view returns (uint) {
    //     return teams[_teamId].totalBetAmount;
    // }

    function createQuestion(
        string memory _id,
        string memory _title,
        string memory _primaryOption,
        string memory _secondaryOption
    ) external returns (uint) {
        require(
            msg.sender == contractOwner,
            "Only the contract owner can create a question"
        );

        questions.push(
            Question(
                _id,
                _title,
                Option(_primaryOption, 0),
                Option(_secondaryOption, 0),
                0
            )
        );

        return questions.length;
    }

    function createBet(
        uint _questionIndex,
        bool _primaryOptionSelected
    ) external payable {
        require(msg.sender != contractOwner, "Contract owner can't make a bet");
        require(msg.value > 0.01 ether, "Bet amount too small");

        deposit();

        (bool sent, ) = contractOwner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        Question memory question = questions[_questionIndex];

        Option memory selectedOption = _primaryOptionSelected
            ? question.primaryOption
            : question.secondaryOption;

        question.totalBetMoney += msg.value;
        selectedOption.totalBetAmount += msg.value;
        bets.push(Bet(msg.sender, msg.value, question, selectedOption));
    }

    // function createBet(string memory _name, uint _teamId) external payable {
    //     require(msg.sender != contractOwner, "owner can't make a bet");
    //     require(
    //         numBetsAddress[msg.sender] == 0,
    //         "you have already placed a bet"
    //     );
    //     require(msg.value > 0.01 ether, "bet more");

    //     deposit();

    //     bets.push(Bet(_name, msg.sender, msg.value, teams[_teamId]));

    //     if (_teamId == 0) {
    //         teams[0].totalBetAmount += msg.value;
    //     }
    //     if (_teamId == 1) {
    //         teams[1].totalBetAmount += msg.value;
    //     }

    //     numBetsAddress[msg.sender]++;

    //     (bool sent, bytes memory data) = contractOwner.call{value: msg.value}("");
    //     require(sent, "Failed to send Ether");

    //     totalBetMoney += msg.value;

    //     emit NewBet(msg.sender, msg.value, teams[_teamId]);
    // }

    // function teamWinDistribution(uint _teamId) public payable onlyOwner {
    //     deposit();
    //     uint div;

    //     if (_teamId == 0) {
    //         for (uint i = 0; i < bets.length; i++) {
    //             if (
    //                 keccak256(abi.encodePacked((bets[i].teamBet.name))) ==
    //                 keccak256(abi.encodePacked("team1"))
    //             ) {
    //                 address payable receiver = payable(bets[i].addy);
    //                 console.log(receiver);
    //                 div =
    //                     (bets[i].amount *
    //                         (10000 +
    //                             ((getTotalBetAmount(1) * 10000) /
    //                                 getTotalBetAmount(0)))) /
    //                     10000;

    //                 (bool sent, bytes memory data) = receiver.call{value: div}(
    //                     ""
    //                 );
    //                 require(sent, "Failed to send Ether");
    //             }
    //         }
    //     } else {
    //         for (uint i = 0; i < bets.length; i++) {
    //             if (
    //                 keccak256(abi.encodePacked((bets[i].teamBet.name))) ==
    //                 keccak256(abi.encodePacked("team2"))
    //             ) {
    //                 address payable receiver = payable(bets[i].addy);
    //                 div =
    //                     (bets[i].amount *
    //                         (10000 +
    //                             ((getTotalBetAmount(0) * 10000) /
    //                                 getTotalBetAmount(1)))) /
    //                     10000;
    //                 console.log(getTotalBetAmount(0));
    //                 console.log(div);

    //                 (bool sent, bytes memory data) = receiver.call{value: div}(
    //                     ""
    //                 );
    //                 require(sent, "Failed to send Ether");
    //             }
    //         }
    //     }

    //     totalBetMoney = 0;
    //     teams[0].totalBetAmount = 0;
    //     teams[1].totalBetAmount = 0;

    //     for (uint i = 0; i < bets.length; i++) {
    //         numBetsAddress[bets[i].addy] = 0;
    //     }
    // }
}
