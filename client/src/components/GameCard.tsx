import Image from "next/image";
import React from "react";

interface IGameCardProps {
  image: string;
  title: string;
}

const GameCard = ({ image, title }: IGameCardProps) => {
  return (
    <div className="w-64">
      <Image src={image} width={256} height={170} alt="Ok" />
      <h6 className="text-whites-1 font-semibold">{title}</h6>
    </div>
  );
};

export default GameCard;
