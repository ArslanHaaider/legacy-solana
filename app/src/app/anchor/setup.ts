// "use client ";
// import {
//   Program,
//   IdlAccounts,
//   workspace,
//   AnchorProvider,
//   Wallet,
//   setProvider,
//   getProvider,
// } from "@coral-xyz/anchor";
// import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
// import { Counter } from "./type"; // Adjust the path if neede
// import * as idl from "../../../../target/idl/counter.json";
// const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// let provider;
// // declare var window: any;

// // export const program = new Program(idl,provider);
// export const program = new Program<Counter>(idl as any, provider);
// console.log("printing program", program.programId);

// export const [counterPDA] = PublicKey.findProgramAddressSync(
//   [Buffer.from("counter")],
//   program.programId
// );

// // This is just a TypeScript type for the Counter data structure based on the IDL
// // We need this so TypeScript doesn't yell at us
// export type CounterData = IdlAccounts<Counter>["counter"];
