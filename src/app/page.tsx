"use client";

import { ButtonSelector } from "@/components/button-selector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
const moves: AcrobaticMove[] = require("../data/poses.json");

export enum DIFFICULTY {
  EASY = "easy",
  INTERMEDIATE = "intermediate",
  HARD = "hard",
  REALLY_HARD = "really-hard",
}

interface AcrobaticMove {
  title: string;
  img: string;
  number_of_people: number;
  position: string;
  difficulty: DIFFICULTY;
}

const DIFFICULTIES = [
  { id: DIFFICULTY.EASY, label: "easy" },
  { id: DIFFICULTY.INTERMEDIATE, label: "intermediate" },
  { id: DIFFICULTY.HARD, label: "hard" },
  { id: DIFFICULTY.REALLY_HARD, label: "really hard" },
];

function getRandomPositions(difficulty: DIFFICULTY): AcrobaticMove[] {
  // Filter moves by difficulty
  const easyMoves: AcrobaticMove[] = moves.filter(
    (move) => move.difficulty === "easy"
  );
  const intermediateMoves: AcrobaticMove[] = moves.filter(
    (move) => move.difficulty === "intermediate"
  );
  const hardMoves: AcrobaticMove[] = moves.filter(
    (move) => move.difficulty === "hard"
  );
  const superHardMoves: AcrobaticMove[] = moves.filter(
    (move) => move.difficulty === "really-hard"
  );

  // Shuffle array
  const shuffleArray = (array: AcrobaticMove[]): AcrobaticMove[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Helper function to get random moves from an array
  const getRandomMoves = (array: AcrobaticMove[], count: number) =>
    shuffleArray(array).slice(0, count);

  // Generate positions based on difficulty
  let positions: AcrobaticMove[] = [];
  switch (difficulty) {
    case "easy":
      positions = getRandomMoves(easyMoves, 6);
      break;
    case "intermediate":
      positions = getRandomMoves(easyMoves, 2).concat(
        getRandomMoves(intermediateMoves, 4)
      );
      break;
    case "hard":
      positions = getRandomMoves(easyMoves, 1).concat(
        getRandomMoves(intermediateMoves, 3),
        getRandomMoves(hardMoves, 2)
      );
      break;
    case "really-hard":
      positions = getRandomMoves(easyMoves, 1).concat(
        getRandomMoves(intermediateMoves, 2),
        getRandomMoves(hardMoves, 1),
        getRandomMoves(superHardMoves, 1)
      );
      break;
    default:
      console.error("Invalid difficulty level");
  }

  return positions;
}

function replaceSpacesAndLower(inputString: string): string {
  return inputString.replace(/\s+/g, "+").toLowerCase();
}

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DIFFICULTY>();
  const [positions, setPositions] = useState<AcrobaticMove[]>();

  useEffect(() => {
    if (selectedDifficulty) {
      setPositions(getRandomPositions(selectedDifficulty));
    }
  }, [selectedDifficulty]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-12 pt-24 pb-8 bg-dots">
      {!selectedDifficulty ? (
        <>
          <div>
            <h1 className="flex w-full justify-center text-3xl">
              Generate your&nbsp;
            </h1>
            <div className="bg-gradient-to-br font-bold text-6xl w-full flex justify-center from-primary to-[#53dea7] text-transparent bg-clip-text">
              Acroflow
            </div>
          </div>
          <div className="mb-32 flex flex-col gap-y-4 text-center w-full">
            {DIFFICULTIES?.map((difficulty) => (
              <ButtonSelector
                key={difficulty?.id}
                id={difficulty?.id}
                onClick={setSelectedDifficulty}
              >
                {difficulty?.label}
              </ButtonSelector>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex flex-col gap-y-4 w-full">
            {positions?.map((position, index) => {
              return (
                <>
                  <Accordion type="single" collapsible>
                    <AccordionItem
                      value={position?.title}
                      className="flex flex-col px-4 w-full rounded-lg bg-zinc-50 border border-primary"
                    >
                      <AccordionTrigger>
                        <div key={position?.title} className="">
                          <div className="flex flex-row items-center gap-x-2">
                            <div className="bg-gradient-to-br font-bold text-3xl flex  from-primary to-[#53dea7] text-transparent bg-clip-text">
                              #{index + 1}
                            </div>
                            <p className="text-primary font-bold">
                              {position?.title}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="w-full items-center flex flex-col gap-y-4">
                          <div className="relative h-full w-full items-center p-40 align-top">
                            <Image
                              src={position?.img}
                              alt={position?.title}
                              className="h-auto max-w-full object-contain"
                              fill
                            />
                          </div>
                          <a
                            className="hover:underline text-primary cursor-pointer"
                            href={`https://www.youtube.com/results?search_query=${replaceSpacesAndLower(
                              position.title
                            )}+acroyoga`}
                            target="_blank"
                          >
                            Watch on YouTube
                          </a>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              );
            })}
          </div>
          <Button
            size={"lg"}
            className="w-full h-16 capitalize bg-gradient-to-br from-primary to-[#53dea7]"
            onClick={() => setPositions(getRandomPositions(selectedDifficulty))}
          >
            Shuffle
          </Button>
        </div>
      )}
      <p className="text-xs text-zinc-400">Made with 💚 by PDC</p>
    </main>
  );
}
