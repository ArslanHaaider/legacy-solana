'use client'
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navbar = ()=>{
    return <>
    <div className="flex justify-between  border-y-white border-b-2">
        <p className="font-mono text-3xl p-7 text-white">Legacy Suite</p>
        <div className="p-6">
        <WalletMultiButton/>
        </div>
    </div>
    </>

}

export default Navbar;