'use client'
import { useEffect, useState } from "react";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Program,
  IdlAccounts,
  AnchorProvider,
} from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as idl from "../../../../target/idl/counter.json";
import { Counter } from "../anchor/type.ts"; // Adjust the path if needed
import { WalletSendTransactionError } from "@solana/wallet-adapter-base";

// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export default function CounterState() {
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const [counterData, setCounterData] = useState<CounterData | null>(null);
  const { publicKey, sendTransaction } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [program, setProgram] = useState<Program<Counter> | null>(null);
  const [counterPDA, setCounterPDA] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (anchorWallet) {
      const provider = new AnchorProvider(
        connection,
        anchorWallet,
        { commitment: "confirmed"}
      );
      console.log(provider.connection);
      const prog = new Program<Counter>({
        "address": "35PUHEFrHabVCwCCNnbEKFXQRn6MquzRkC7jT3ktg7uG",
        "metadata": {
          "name": "counter",
          "version": "0.1.0",
          "spec": "0.1.0",
          "description": "Created with Anchor"
        },
        "instructions": [
          {
            "name": "increment",
            "discriminator": [
              11,
              18,
              104,
              9,
              104,
              174,
              59,
              33
            ],
            "accounts": [
              {
                "name": "counter",
                "writable": true,
                "pda": {
                  "seeds": [
                    {
                      "kind": "const",
                      "value": [
                        99,
                        111,
                        117,
                        110,
                        116,
                        101,
                        114
                      ]
                    }
                  ]
                }
              }
            ],
            "args": []
          },
          {
            "name": "initialize",
            "discriminator": [
              175,
              175,
              109,
              31,
              13,
              152,
              155,
              237
            ],
            "accounts": [
              {
                "name": "user",
                "writable": true,
                "signer": true
              },
              {
                "name": "counter",
                "writable": true,
                "pda": {
                  "seeds": [
                    {
                      "kind": "const",
                      "value": [
                        99,
                        111,
                        117,
                        110,
                        116,
                        101,
                        114
                      ]
                    }
                  ]
                }
              },
              {
                "name": "systemProgram",
                "address": "11111111111111111111111111111111"
              }
            ],
            "args": []
          },
          {
            "name": "testing",
            "discriminator": [
              47,
              45,
              104,
              225,
              61,
              223,
              182,
              240
            ],
            "accounts": [],
            "args": []
          }
        ],
        "accounts": [
          {
            "name": "counter",
            "discriminator": [
              255,
              176,
              4,
              245,
              188,
              253,
              124,
              25
            ]
          }
        ],
        "types": [
          {
            "name": "counter",
            "type": {
              "kind": "struct",
              "fields": [
                {
                  "name": "count",
                  "type": "u64"
                },
                {
                  "name": "bump",
                  "type": "u8"
                }
              ]
            }
          }
        ]
      }, provider);
  
      setProgram(prog);
      
      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from("counter")],
        prog.programId
      );
      setCounterPDA(pda);
    }
  }, [anchorWallet]);

  useEffect(() => {
    if (!program || !counterPDA) return;

    const fetchCounterData = async () => {
      try {
        const data = await program.account.counter.fetch(counterPDA);
        setCounterData(data);
      } catch (error) {
        console.error("Failed to fetch counter data:", error);
      }
    };

    fetchCounterData();

    const subscriptionId = connection.onAccountChange(
      counterPDA,
      (accountInfo) => {
        try {
          setCounterData(
            program.coder.accounts.decode("counter", accountInfo.data)
          );
        } catch (error) {
          console.error("Failed to decode account data:", error);
        }
      }
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, []);

  const initializer = async () => {
    try {
      if (!publicKey || !program) {
        console.error("Wallet not connected or program not initialized!");
        return;
      }
  
      console.log("Preparing transaction...");
      const transaction = await program.methods.initialize().accounts({user:publicKey}).transaction();  
      const transaction2 = await program.methods.increment().accounts({}).transaction();  

  
      console.log("Sending transaction...");
      const signature = await sendTransaction(transaction2, connection);
      console.log("Transaction sent with signature:", signature);
    } catch (error) {
      console.error("Transaction failed:", error);
      if (error instanceof WalletSendTransactionError) {
        console.error("WalletSendTransactionError details:", error);
      }
    }
  };
  

  return (
    <div>
      <WalletMultiButton />
      <p className="text-lg">Count: {counterData?.count?.toString()}</p>
      <button onClick={initializer} className="btn border p-4">
        Call Initialize
      </button>
    </div>
  );
}

type CounterData = IdlAccounts<Counter>["counter"];
