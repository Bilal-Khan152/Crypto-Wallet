/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState } from "react";

import { mnemonicToSeed } from "bip39";

import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

function SolanaWallet({ mnemonic, darkTheme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [balances, setBalances] = useState([]);

  const fetchBalance = async (publicKey) => {
    try {
      const connection = new Connection(
        clusterApiUrl("mainnet-beta"),
        "confirmed"
      );
      const balance = await connection.getBalance(new PublicKey(publicKey));
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 0;
    }
  };

  const handleOnClick = async () => {
    if (!mnemonic) return; // Ensure mnemonic exists

    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;

    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(new Uint8Array(secret));
    setCurrentIndex(currentIndex + 1);
    setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]); // Convert to string
    setBalances(fetchBalance());
  };

  return (
    <div
      className={
        darkTheme
          ? " md:w-[50vw] w-full bg-[#dfe6e9] py-12 h-[80vh] flex flex-col justify-center items-center "
          : "md:w-[50vw] w-full bg-[#34495e] py-12 h-[80vh]  flex flex-col justify-center items-center"
      }
    >
      <p
        className={
          darkTheme
            ? "text-3xl text-black italic text-center"
            : "text-3xl text-[#ecf0f1] italic text-center"
        }
      >
        Solana Wallet
      </p>

      <div
        className={
          darkTheme
            ? "md:w-[45vw] w-[90vw] h-[45vh] mt-3 border-[1px] rounded bg-[#dfe6e9]   mx-auto overflow-auto"
            : "md:w-[45vw] w-[90vw] h-[45vh] mt-3 border-[1px] rounded bg-[#2c3e50]   mx-auto overflow-auto"
        }
      >
        <div>
          <p
            className={
              darkTheme
                ? "text-2xl text-black italic  sticky top-0 bg-[#b2bec3] z-10 text-center p-2"
                : "text-2xl text-[#ecf0f1] italic  sticky top-0 bg-[#34495e] z-10 text-center p-2"
            }
          >
            Address :
          </p>

          <ul>
            {publicKeys.map((key, index) => {
              return (
                <>
                  <li
                    className={
                      darkTheme
                        ? "text-[#636e72] md:text-sm text-[11px] mt-2 flex md:flex-row flex-col justify-center   items-center "
                        : "text-[#ffeaa7] md:text-sm text-[11px] mt-2 flex md:flex-row flex-col justify-center   items-center "
                    }
                    key={index}
                  >
                    {key}{" "}
                    <p className="text-black text-[16px] font-semibold ps-1 pe-1">
                      {" "}
                      Balance :{" "}
                    </p>{" "}
                    {balances[index] !== undefined
                      ? balances[index].toFixed(2)
                      : 0.0}{" "}
                    SOL
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </div>

      <button
        onClick={handleOnClick}
        className=" bg-slate-950  text-slate-400 border border-slate-400 border-b-4 font-medium overflow-hidden relative text-xl px-6 py-1.5 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group  mt-3.5  cursor-pointer"
      >
        <span className="  bg-slate-400 shadow-slate-400  absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
        Generate
      </button>
    </div>
  );
}
export default SolanaWallet;
