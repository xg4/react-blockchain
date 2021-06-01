import crypto from "crypto";
import { useCallback, useMemo, useState } from "react";

interface Block {
  hash: string;
  transactions: string[];
}

function sha256(val: string) {
  return crypto.createHash("sha256").update(val).digest("hex");
}

export default function useBlockchain() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<string[]>([]);

  const valid = useMemo(
    () =>
      blocks.every((block, index) => {
        const prevBlock = blocks[index - 1] ?? { hash: "" };
        const hash = sha256(
          `${prevBlock.hash}${JSON.stringify(block.transactions)}`
        ).toString();
        return hash === block.hash;
      }),
    [blocks]
  );

  const addTransaction = useCallback(
    (message: string) => {
      setTransactions([...transactions, message]);
    },
    [transactions, setTransactions]
  );

  const writeBlock = useCallback(() => {
    if (transactions.length === 0) {
      return;
    }

    const _transactions = [...transactions];
    setTransactions([]);

    const prevBlock = blocks[blocks.length - 1] ?? { hash: "" };
    const hash = sha256(
      `${prevBlock.hash}${JSON.stringify(_transactions)}`
    ).toString();

    setBlocks([...blocks, { hash, transactions: _transactions }]);
  }, [transactions, setTransactions, blocks, setBlocks]);

  return {
    writeBlock,
    addTransaction,
    valid,
    blocks,
    transactions,
  };
}
