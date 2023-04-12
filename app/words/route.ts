import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cleanClues, cleanWord } from "./clean-data";
import { headers, cookies } from "next/headers";

export const revalidate = 0;

export async function POST(request: Request) {
  const supabase = createRouteHandlerSupabaseClient({
    headers,
    cookies,
  });
  const { query } = await request.json();

  const completionConfig = {
    model: "text-davinci-003",
    prompt: query,
    max_tokens: 256,
    temperature: 0,
  };

  //   const res = await fetch("https://api.openai.com/v1/completions", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${process.env.OPENAI_KEY}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(completionConfig),
  //   });

  const word = cleanWord("puzzle.");

  const response = cleanClues(
    word,
    `This word's origin can be traced back to the Latin term "pugillare," meaning a small tablet for writing.

The ancient Greeks used this word to describe their favorite pastime of solving riddles and enigmas.

In medieval times, monks would create intricate designs with this word as a form of meditation and prayer.

It is believed that Leonardo da Vinci was an avid fan of using this word in his spare time, often creating complex puzzles for himself to solve.

During World War II, soldiers were given books filled with these types of games as a way to pass the time while waiting for orders or on long journeys overseas.

Many famous authors have incorporated puzzles into their works throughout history - including Edgar Allan Poe and Agatha Christie!

Some historians believe that early versions of crossword puzzles may have been used by teachers in Ancient Rome as educational tools for students learning new vocabulary words
8.This type game has been found carved into stone tablets dating back over 4000 years ago from Mesopotamia (modern-day Iraq).
9.The first known printed puzzle book containing many examples appeared in London around 1760 under the title 'The Art Of Teaching To Spell And Read'.
10.In Japan during Edo period(1603-1868), people enjoyed playing various kinds such games called "Makura no Soshi" which means pillow book because they could play it even when lying down on pillows`
  );

  const data = { word, response };

  return NextResponse.json({ data });
}
