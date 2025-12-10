export default function HowToVote() {
  return (
    <section className="mt-8 mb-12 p-4 md:p-12 rounded-sm bg-white/90 shadow-lg w-full max-w-2xl mx-auto space-y-2">
      <h3 className="font-black text-center mb-4">HOW TO VOTE</h3>
      <ol className="list-decimal list-inside text-muted-foreground font-semibold text-sm space-y-2">
        <li>
          Click the <span className="font-bold">&quot;VOTE&quot;</span> button
        </li>
        <li>Type in your name and select number of votes in the voting form</li>
        <li>Select the voting method, and follow the prompts accordingly</li>
      </ol>
    </section>
  );
}
