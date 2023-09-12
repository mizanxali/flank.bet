// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.11;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/hardhat/console.sol";
import "./ATM.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract Betting is ATM, Ownable {
    // event NewBet(address bettorAddress, uint amount, Team teamBet);

    struct Bet {
        address bettorAddress;
        uint amount;
        Option selectedOption;
    }

    struct Question {
        string id;
        string title;
        Option primaryOption;
        Option secondaryOption;
        uint totalBetMoney;
        uint totalBetCount;
    }

    struct Option {
        string title;
        uint totalBetAmount;
    }

    Question[] public questions;
    mapping(uint256 => Bet[]) public bets;

    address payable contractOwner;

    constructor() payable {
        contractOwner = payable(msg.sender);
    }

    function getQuestionsLength() public view returns (uint) {
        return questions.length;
    }

    function getAllQuestions()
        public
        view
        onlyOwner
        returns (Question[] memory)
    {
        return questions;
    }

    function getAllBets(
        uint256 _questionIndex
    ) public view onlyOwner returns (Bet[] memory) {
        return bets[_questionIndex];
    }

    function getQuestion(
        uint256 _questionIndex
    ) public view returns (Question memory) {
        return questions[_questionIndex];
    }

    function createQuestion(
        string memory _id,
        string memory _title,
        string memory _primaryOption,
        string memory _secondaryOption
    ) external onlyOwner returns (uint) {
        questions.push(
            Question(
                _id,
                _title,
                Option(_primaryOption, 0),
                Option(_secondaryOption, 0),
                0,
                0
            )
        );

        return questions.length;
    }

    function createBet(
        uint _questionIndex,
        bool _primaryOptionSelected
    ) external payable {
        // require(msg.sender != contractOwner, "Contract owner can't make a bet");
        require(msg.value > 0.01 ether, "Bet amount too small");

        deposit();

        (bool sent, ) = contractOwner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        Question memory question = questions[_questionIndex];

        Option memory selectedOption = _primaryOptionSelected
            ? question.primaryOption
            : question.secondaryOption;

        question.totalBetMoney += msg.value;
        question.totalBetCount++;
        selectedOption.totalBetAmount += msg.value;
        Bet memory bet = Bet(msg.sender, msg.value, selectedOption);
        bets[_questionIndex].push(bet);

        //emit NewBet(msg.sender, msg.value, teams[_teamId]);
    }

    function distributeWinnings(
        uint _questionIndex,
        bool _primaryOptionWon
    ) public payable onlyOwner {
        deposit();
        uint div;

        Bet[] memory theBets = bets[_questionIndex];
        Question memory theQuestion = questions[_questionIndex];

        for (uint i = 0; i < theBets.length; i++) {
            bytes32 selectedOptionTitle = keccak256(
                abi.encodePacked((theBets[i].selectedOption.title))
            );
            bytes32 primaryOptionTitle = keccak256(
                abi.encodePacked((theQuestion.primaryOption.title))
            );
            bytes32 secondaryOptionTitle = keccak256(
                abi.encodePacked((theQuestion.secondaryOption.title))
            );

            if (
                (_primaryOptionWon &&
                    selectedOptionTitle == primaryOptionTitle) ||
                (!_primaryOptionWon &&
                    selectedOptionTitle == secondaryOptionTitle)
            ) {
                address payable receiver = payable(theBets[i].bettorAddress);
                console.log(receiver);
                div =
                    (theBets[i].amount *
                        (10000 +
                            ((theQuestion.totalBetMoney * 10000) /
                                theQuestion.totalBetMoney))) /
                    10000;

                (bool sent, ) = receiver.call{value: div}("");
                require(sent, "Failed to send Ether");
            }
        }
    }
}
