import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { DIFFICULTY } from "@/app/types";
export const ButtonSelector = ({
  children,
  onClick,
  id,
}: {
  children: string;
  id: DIFFICULTY;
  onClick: Dispatch<SetStateAction<DIFFICULTY | undefined>>;
}) => {
  return (
    <Button
      size={"lg"}
      className="w-full h-16 capitalize bg-gradient-to-br from-primary to-[#53dea7]"
      onClick={() => onClick(id)}
    >
      {children}
    </Button>
  );
};
