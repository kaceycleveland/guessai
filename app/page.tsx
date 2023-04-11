import Login from "./login";
import Clues from "./clues";

export default function Page() {
  return (
    <div className="w-full p-4">
      <Login />
      <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 inline-block text-transparent bg-clip-text">
        GuessAI
      </h1>
      <Clues />
    </div>
  );
}
