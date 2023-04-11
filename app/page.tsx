import Login from "./login";

export default function Page() {
  return (
    <div>
      <Login />
      <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 inline-block text-transparent bg-clip-text">
        GuessAI
      </h1>
      <div>
        <div className="p-4 bg-slate-950 bg-opacity-40 border border-slate-900 backdrop-blur-lg m-4 rounded text-white shadow-md">
          The meaning behind any given term can change over time depending on
          cultural context and usage patterns; however, knowing what something
          meant when it first came into existence gives insight into why people
          chose those particular sounds/letters/syllables etc., for their name
          at all! In other words: understanding early meanings sheds light on
          later ones too!
        </div>
      </div>
    </div>
  );
}
