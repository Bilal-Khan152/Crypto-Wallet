/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { Wallet, HDNodeWallet } from "ethers";
import { mnemonicToSeed } from "bip39";

import { useState } from "react";

function EthWallet({ mnemonic, darkTheme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [balances, setBalances] = useState([]);

  const fetchBalance = async (address) => {
    try {
      const provider = new ethers.JsonRpcProvider(
        "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
      );
      const ethBalance = await provider.getBalance(address);
      return ethers.formatEther(ethBalance); // Convert from Wei to ETH
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 0;
    }
  };

  const handleOnClick = async () => {
    if (!mnemonic) return; // Ensure mnemonic exists

    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;

    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const wallet = new Wallet(child.privateKey);
    setBalances(fetchBalance());
    setCurrentIndex(currentIndex + 1);
    setAddresses([...addresses, wallet.address]);
  };
  return (
    <div
      className={
        darkTheme
          ? " w-[50vw] bg-[#dfe6e9] py-12 h-[80vh]  "
          : " w-[50vw] bg-[#34495e] py-12 h-[80vh]  "
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
            ? "w-[45vw] h-[45vh] mt-3 border-[1px] rounded bg-[#dfe6e9]   mx-auto overflow-auto"
            : "w-[45vw] h-[45vh] mt-3 border-[1px] rounded bg-[#2c3e50]   mx-auto overflow-auto"
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
            {addresses.map((p, index) => {
              return (
                <>
                  <li
                    className={
                      darkTheme
                        ? "text-[#636e72] mt-2 flex justify-center   items-center "
                        : "text-[#ffeaa7] mt-2 flex justify-center   items-center "
                    }
                    key={index}
                  >
                    {p}{" "}
                    <p className="text-black text-[16px] font-semibold ps-1 pe-1">
                      {" "}
                      Balance:{" "}
                    </p>{" "}
                    {balances[index] !== undefined
                      ? balances[index].toFixed(2)
                      : 0.0}{" "}
                    Eth
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </div>
      <button
        onClick={handleOnClick}
        className="bg-slate-950 text-slate-400 border border-slate-400 border-b-4 font-medium overflow-hidden relative text-xl px-6 py-1.5 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group ml-[270px]  mt-3.5  cursor-pointer"
      >
        <span className="bg-slate-400 shadow-slate-400  absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
        Generate
      </button>
    </div>
  );
}

export default EthWallet;
