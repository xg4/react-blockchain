import { useEffect, useState } from "react";
import useBlockchain from "../hooks/useBlockchain";

export default function Home() {
  const { addTransaction, transactions, writeBlock, blocks, valid } =
    useBlockchain();
  const [text, setText] = useState("");

  useEffect(() => {
    const timer = setInterval(writeBlock, 3000);
    return () => {
      clearInterval(timer);
    };
  }, [writeBlock]);
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto pt-5">
        <form
          className="mb-4 flex"
          onSubmit={(evt) => {
            evt.preventDefault();
            addTransaction(text);
            setText("");
          }}
        >
          <input
            className="flex-1 max-w-md px-2 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:border-transparent"
            type="text"
            value={text}
            required
            placeholder="message"
            onChange={(evt) => {
              setText(evt.target.value);
            }}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 focus:outline-none transition text-white px-8 py-3"
          >
            Add
          </button>
        </form>

        <h2 className="font-semibold text-lg mb-2">
          {blocks.length} Blocks ({valid ? "Valid" : "Invalid"})
        </h2>

        {!!transactions.length && (
          <div className="mb-4">
            <h2 className="font-semibold text-lg mb-2">Pending Transactions</h2>
            <ul>
              {transactions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="font-semibold text-lg mb-2">Blocks</h2>
          <ul>
            {[...blocks].reverse().map((block) => (
              <li
                className="inline-block text-sm bg-indigo-100 p-4 shadow rounded-xl border-2 border-indigo-300 mb-4"
                key={block.hash}
              >
                <h3>{block.hash}</h3>
                <pre>{JSON.stringify(block.transactions, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
