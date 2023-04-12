import Login from "./login";
import Clues from "./clues";
import { Button } from "@/components/button";

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full p-4">
      <Login />
      <div className="flex flex-col gap-4 w-full max-w-4xl">
        <Clues />
        <div className="sticky bottom-4 p-4 bg-slate-950 rounded bg-opacity-90 shadow-lg flex flex-col gap-4">
          <Button variant="secondary">Give me a clue</Button>
          <div className="flex gap-4">
            <input
              className="shadow appearance-none border rounded w-full flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="word"
              type="text"
              placeholder="Guess a word"
            />
            <Button className="p-4">Guess</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
