'use client'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import Image from "next/image";
import CounterState from "./legacy/page";

import Navbar from "./components/Navbar";
import { Card, Button } from '@mantine/core';
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
export default function Home() {
  const {connected} = useWallet();
  const [loggedIn,setLoggedIn] = useState<boolean>(false);
  useEffect(()=>{
    if(connected){
      setLoggedIn(true);
    }
  })
  return (
    <>
    {/* <Test/> */}
    <Navbar/>
    <div className="w-full bg-black ">
      <div className="flex justify-center items-center  ">
        <Card className="bg-black mt-8 w-1/2 flex justify-center items-center text-3xl font-mono lg:min-h-[500px]">
          <p>Welcom To Legacy Suite</p>
          {loggedIn?<div className="flex justify-around  w-4/5 mt-20">
            <Button variant="filled" color="rgba(0, 0, 0, 1)" size="xl" radius="md" ><Link href={"./owner"}>Owner</Link></Button>
            <Button variant="filled" color="rgba(0, 0, 0, 1)" size="xl" radius="md">Benificiary</Button>
          </div>:
          <div>
            <WalletMultiButton/>
          </div>

          }
          </Card>         
      </div>
    </div>
    </>
  )
}