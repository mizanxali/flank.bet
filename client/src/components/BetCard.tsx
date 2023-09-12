import { IQuestion } from "@/types";
import React, { useMemo, useState } from "react";

enum Options {
  primary,
  secondary,
}

interface IBetCardProps {
  bet: IQuestion;
}

function BetCard({
  bet: { active, options, question, timestamp, type },
}: IBetCardProps) {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Options>();
  const [selectedAmount, setSelectedAmount] = useState(0);

  const canLockBet = useMemo(
    () => selectedOption !== undefined && selectedAmount,
    [selectedAmount, selectedOption]
  );

  const lockBetHandler = () => {};

  return (
    <div className="w-full rounded-md flex flex-col gap-4 p-4 border-2 border-light-8 text-center text-whites-1">
      <div className="w-full flex justify-between">
        <span>
          {question} - {active && "ACTIVE"}
        </span>
        <span
          className="cursor-pointer"
          onClick={() => setIsCardExpanded(!isCardExpanded)}
        >
          +
        </span>
      </div>

      {isCardExpanded && (
        <>
          <div className="rounded-md border border-dark-3 flex flex-col">
            <div className="flex justify-around border-b border-dark-3 py-3 font-bold">
              <span className="flex-1 text-whites-3">{options[0]}</span>
              <span className="flex-1 text-whites-3">Stats</span>
              <span className="flex-1 text-whites-3 ">{options[1]}</span>
            </div>
            <StatRow
              primaryClassname="text-light-2"
              secondaryClassname="text-alternate-1"
              label="Winning Prediction"
              primaryValue="25%"
              secondaryValue="75%"
            />
            <StatRow
              primaryClassname="text-light-2"
              secondaryClassname="text-alternate-1"
              label="Return Ratio"
              primaryValue="1.5.1"
              secondaryValue="5.1.1"
            />
            <StatRow
              primaryClassname="text-light-2"
              secondaryClassname="text-alternate-1"
              label="No. of players"
              primaryValue="1.5k"
              secondaryValue="2k"
            />
            <StatRow
              primaryClassname="text-light-2"
              secondaryClassname="text-alternate-1"
              label="Highest Bet"
              primaryValue="150k"
              secondaryValue="111k"
            />
            <StatRow
              primaryClassname="text-light-2"
              secondaryClassname="text-alternate-1"
              label="Highest Bettor"
              primaryValue="ALI J"
              secondaryValue="Dystopia"
            />
          </div>

          <div className="w-full flex gap-4 items-center">
            <div>Choose an Option</div>
            <div className="flex-1 justify-between flex gap-3">
              <OptionButton
                text={options[0]}
                isSelected={selectedOption === Options.primary}
                onClick={() => setSelectedOption(Options.primary)}
              />
              <OptionButton
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
                text="0.025 ETH"
                isSelected={selectedAmount === 0.025}
                onClick={() => setSelectedAmount(0.025)}
              />
              <OptionButton
                text="0.05 ETH"
                isSelected={selectedAmount === 0.05}
                onClick={() => setSelectedAmount(0.05)}
              />
              <OptionButton
                text="0.075 ETH"
                isSelected={selectedAmount === 0.075}
                onClick={() => setSelectedAmount(0.075)}
              />
              <OptionButton
                text="0.1 ETH"
                isSelected={selectedAmount === 0.1}
                onClick={() => setSelectedAmount(0.1)}
              />
              <div className="text-light-2 rounded-md border border-light-2 py-2 flex-[2] text-center">
                Enter Custom Amount
              </div>
            </div>
          </div>

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
}: {
  text: string;
  isSelected: boolean;
  onClick?: () => void;
}) => {
  if (isSelected)
    return (
      <div
        onClick={onClick}
        className=" bg-light-1 text-light-7 rounded-md border border-light-2 py-2 flex-1 text-center cursor-pointer"
      >
        {text}
      </div>
    );

  return (
    <div
      onClick={onClick}
      className="text-light-2 rounded-md border border-light-2 py-2 flex-1 text-center cursor-pointer"
    >
      {text}
    </div>
  );
};
