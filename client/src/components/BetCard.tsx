import db from "@/db";
import { IQuestion } from "@/types";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

enum Options {
  primary,
  secondary,
}

interface IBetCardProps {
  qn: IQuestion;
  depositToContract: (() => void) | undefined;
}

function BetCard({
  qn: { active, options, question, timestamp, type, id, bets },
  depositToContract,
}: IBetCardProps) {
  const { address, isDisconnected, isConnected } = useAccount();

  const myPlacedBet = bets.find((bet) => bet.address === address);

  const primaryBets = bets.filter((bet) => bet.option === 0);
  const secondaryBets = bets.filter((bet) => bet.option === 1);

  const primaryBetCount = primaryBets.length;
  const secondaryBetCount = secondaryBets.length;

  const primaryBetAmount = primaryBets.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);
  const secondaryBetAmount = secondaryBets.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);

  var highestPrimaryBetAmount = Math.max.apply(
    Math,
    primaryBets.map(function (o) {
      return o.amount;
    })
  );
  var highestPrimaryBet = primaryBets.find(function (o) {
    return o.option === 0 && o.amount == highestPrimaryBetAmount;
  });

  var highestSecondaryBetAmount = Math.max.apply(
    Math,
    secondaryBets.map(function (o) {
      return o.amount;
    })
  );
  var highestSecondaryBet = secondaryBets.find(function (o) {
    return o.option === 1 && o.amount == highestSecondaryBetAmount;
  });

  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    myPlacedBet ? myPlacedBet.option : undefined
  );
  const [selectedAmount, setSelectedAmount] = useState(
    myPlacedBet ? myPlacedBet.amount : 0
  );

  const canLockBet = useMemo(
    () => selectedOption !== undefined && selectedAmount,
    [selectedAmount, selectedOption]
  );

  const lockBetHandler = async () => {
    // @ts-ignore
    depositToContract?.({
      args: [parseEther(selectedAmount.toString())],
      value: parseEther(selectedAmount.toString()),
    });

    const questionRef = doc(db, `matches/2578928/questions/${id}`);
    await updateDoc(questionRef, {
      bets: arrayUnion({
        address: address,
        option: selectedOption,
        amount: selectedAmount,
        winnings: 0,
      }),
    });
  };

  const showStatsTable = bets && bets.length > 0;
  const showBettingButtons = (active && address) || (!active && !!myPlacedBet);

  let helperText = "";
  if (active) {
    if (!address) helperText = "Connect wallet to bet on this event.";
  } else {
    if (!showStatsTable) helperText = "No bets were placed on this event.";
    else {
      if (!!!myPlacedBet) helperText = "You did not bet on this event.";
    }
  }

  return (
    <div className="w-full rounded-md flex flex-col gap-4 p-4 border-2 border-light-8 text-center text-whites-1">
      <div className="w-full flex justify-between items-center">
        <span>{question}</span>
        <span
          className="cursor-pointer"
          onClick={() => setIsCardExpanded(!isCardExpanded)}
        >
          {isCardExpanded ? <AiOutlineMinusCircle /> : <AiOutlinePlusCircle />}
        </span>
      </div>

      {isCardExpanded && (
        <>
          {showStatsTable && (
            <div className="rounded-md border border-dark-3 flex flex-col">
              <div className="flex justify-around border-b border-dark-3 py-3 font-bold">
                <span className="flex-1 text-whites-3">{options[0]}</span>
                <span className="flex-1 text-whites-3">Stats</span>
                <span className="flex-1 text-whites-3 ">{options[1]}</span>
              </div>
              {/* <StatRow
                primaryClassname="text-light-2"
                secondaryClassname="text-alternate-1"
                label="Winning Prediction"
                primaryValue="25%"
                secondaryValue="75%"
              /> */}
              <StatRow
                primaryClassname="text-light-2"
                secondaryClassname="text-alternate-1"
                label="Total Bet"
                primaryValue={primaryBetAmount.toString() + " MATIC"}
                secondaryValue={secondaryBetAmount.toString() + " MATIC"}
              />
              <StatRow
                primaryClassname="text-light-2"
                secondaryClassname="text-alternate-1"
                label="No. of players"
                primaryValue={primaryBetCount.toString()}
                secondaryValue={secondaryBetCount.toString()}
              />
              <StatRow
                primaryClassname="text-light-2"
                secondaryClassname="text-alternate-1"
                label="Highest Bet"
                primaryValue={
                  primaryBetCount > 0
                    ? highestPrimaryBetAmount.toString() + " MATIC"
                    : "-"
                }
                secondaryValue={
                  secondaryBetCount > 0
                    ? highestSecondaryBetAmount.toString() + " MATIC"
                    : "-"
                }
              />
              {highestPrimaryBet && highestSecondaryBet && (
                <StatRow
                  primaryClassname="text-light-2"
                  secondaryClassname="text-alternate-1"
                  label="Highest Bettor"
                  primaryValue={
                    primaryBetCount > 0 ? highestPrimaryBet.address : "-"
                  }
                  secondaryValue={
                    secondaryBetCount > 0 ? highestSecondaryBet.address : "-"
                  }
                />
              )}
            </div>
          )}

          {showBettingButtons && (
            <>
              <div className="w-full flex gap-4 items-center">
                <div>Choose an Option</div>
                <div className="flex-1 justify-between flex gap-3">
                  <OptionButton
                    isDisabled={!!myPlacedBet}
                    text={options[0]}
                    isSelected={selectedOption === Options.primary}
                    onClick={() => setSelectedOption(Options.primary)}
                  />
                  <OptionButton
                    isDisabled={!!myPlacedBet}
                    text={options[1]}
                    isSelected={selectedOption === Options.secondary}
                    onClick={() => setSelectedOption(Options.secondary)}
                  />
                </div>
              </div>

              <div className="w-full flex gap-4 items-center">
                <div>Choose an Amount</div>
                <div className="flex-1 justify-between flex gap-3">
                  <OptionButton
                    isDisabled={!!myPlacedBet}
                    text="0.025 MATIC"
                    isSelected={selectedAmount === 0.025}
                    onClick={() => setSelectedAmount(0.025)}
                  />
                  <OptionButton
                    isDisabled={!!myPlacedBet}
                    text="0.05 MATIC"
                    isSelected={selectedAmount === 0.05}
                    onClick={() => setSelectedAmount(0.05)}
                  />
                  <OptionButton
                    isDisabled={!!myPlacedBet}
                    text="0.075 MATIC"
                    isSelected={selectedAmount === 0.075}
                    onClick={() => setSelectedAmount(0.075)}
                  />
                  <OptionButton
                    isDisabled={!!myPlacedBet}
                    text="0.1 MATIC"
                    isSelected={selectedAmount === 0.1}
                    onClick={() => setSelectedAmount(0.1)}
                  />
                  <div className="text-light-2 rounded-md border border-light-2 py-2 flex-[2] text-center">
                    Enter Custom Amount
                  </div>
                </div>
              </div>

              {myPlacedBet ? (
                <>
                  {!active && (
                    <>
                      {myPlacedBet.winnings > 0 ? (
                        <div>
                          Congratulations! You predicted correctly and won{` `}
                          <span className="text-light-1">
                            {myPlacedBet.winnings} MATIC.
                          </span>
                        </div>
                      ) : (
                        <div>
                          Oops! Your prediction was incorrect. Better luck next
                          time.
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div>
                  <button
                    disabled={!canLockBet}
                    onClick={lockBetHandler}
                    className={`${
                      canLockBet
                        ? "bg-light-1 text-whites-3"
                        : "bg-dark-4 text-light-1"
                    }  font-semibold px-10 py-4 rounded-md`}
                  >
                    Review and Place Bet
                  </button>
                </div>
              )}
            </>
          )}

          {helperText.length > 0 && (
            <div className="text-light-6">{helperText}</div>
          )}
        </>
      )}
    </div>
  );
}

export default BetCard;

const StatRow = ({
  label,
  primaryClassname,
  primaryValue,
  secondaryClassname,
  secondaryValue,
}: {
  primaryValue: string;
  primaryClassname?: string;
  secondaryValue: string;
  secondaryClassname?: string;
  label: string;
}) => {
  return (
    <div className="flex justify-around border-b border-dark-3 py-3">
      <span className={`flex-1 ${primaryClassname}`}>{primaryValue}</span>
      <span className="flex-1 text-whites-2">{label}</span>
      <span className={`flex-1 ${secondaryClassname}`}>{secondaryValue}</span>
    </div>
  );
};

const OptionButton = ({
  text,
  isSelected,
  onClick,
  isDisabled,
}: {
  text: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick?: () => void;
}) => {
  if (isSelected)
    return (
      <button
        disabled={isDisabled}
        onClick={onClick}
        className=" bg-light-1 text-light-7 rounded-md border border-light-2 py-2 flex-1 text-center"
      >
        {text}
      </button>
    );

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className="text-light-2 rounded-md border border-light-2 py-2 flex-1 text-center"
    >
      {text}
    </button>
  );
};
