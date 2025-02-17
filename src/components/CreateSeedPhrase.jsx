import { useCallback, useRef, useState } from "react";
import { generateMnemonic } from "bip39";
import EthWallet from "./EthWallet";
import SolanaWallet from "./SolanaWallet";

// eslint-disable-next-line react/prop-types
function CreateSeedPhrase({darkTheme }) {
  const [mnemonic, setMnemonic] = useState("");

  const passwordRef = useRef(null) ;


    const copyToClipboard = useCallback (()=>{

    passwordRef.current.select() ;
    window.navigator.clipboard.writeText(mnemonic) ; 


    },[mnemonic])




  return (
    <>
      <div
        className={
          darkTheme ? "w-full h-[50vh] bg-[#dfe6e9]   flex flex-col  justify-around items-center "
          : "w-full h-[50vh] bg-[#34495e]   flex flex-col  justify-around items-center "
        }
      >
        <div>
          <p className={
            darkTheme ? "text-3xl text-black italic " 
            : "text-3xl text-[#ecf0f1] italic "
          }>Seed Phrase</p>
        </div>

        <div className="flex items-center">
          <input
            className="bg-[#bdc3c7] w-[55vw] text-black font-mono  outline-none duration-300 rounded-full px-4 py-2.5  border-[1px] border-black  shadow-2xl "
            type="text"
            value={mnemonic}
            ref={passwordRef}
            readOnly
          />
          {/* <span
  className="rounded-full bg-zinc-200 text-zinc-600 font-mono   px-2 py-2  ml-2   "
  > 
    Reveal
  
  </span> */}

          <button
           onClick={copyToClipboard}
          className="bg-slate-950 text-slate-400 border border-slate-400 border-b-4 font-medium overflow-hidden relative px-3.5 py-1.5 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group ml-2 cursor-pointer">
            <span className="bg-slate-400 shadow-slate-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            Copy
          </button>
        </div>

        <div>
          <button
            onClick={() => {
              const mn = generateMnemonic(); // No need for await
              setMnemonic(mn);
            }}
            className="bg-slate-950 text-slate-400 border border-slate-400 border-b-4 font-medium overflow-hidden relative text-xl px-6 py-1.5 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group ml-2 cursor-pointer"
          >
            <span className="bg-slate-400 shadow-slate-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            Generate
          </button>
        </div>

        {/*        
      <button
        onClick={() => {
          const mn = generateMnemonic(); // No need for await
          setMnemonic(mn);
        }}
      >
        Create Seed Phrase
      </button>
      <input type="text" value={mnemonic} readOnly></input> */}

        {/* Pass mnemonic as a prop */}
      </div>

      <div className="flex">
        <SolanaWallet mnemonic={mnemonic} darkTheme={darkTheme}  />
        <EthWallet mnemonic={mnemonic} darkTheme={darkTheme} />
      </div>
    </>
  );
}

export default CreateSeedPhrase;
