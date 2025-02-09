import { useState } from "react";
import "./App.css";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Wallet, HDNodeWallet } from "ethers";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <div>
      <button
        onClick={() => {
          const mn = generateMnemonic(); // No need for await
          setMnemonic(mn);
        }}
      >
        Create Seed Phrase
      </button>
      <input type="text" value={mnemonic} readOnly></input>

      {/* Pass mnemonic as a prop */}
      <SolanaWallet mnemonic={mnemonic} />
      <EthWallet mnemonic={mnemonic} />
    </div>
  );
}

export function SolanaWallet({ mnemonic }) {
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

  return (
    <div>
      <button
        onClick={async function () {
          if (!mnemonic) return; // Ensure mnemonic exists

          const seed = await mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;

          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(new Uint8Array(secret));
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]); // Convert to string
          setBalances(fetchBalance());
        }}
      >
        Add Sol Wallet
      </button>

      <h3>Solana Public Keys:</h3>
      <ul>
        {publicKeys.map((key, index) => (
          <li key={index}>
            {key} Balance:{" "}
            {balances[index] !== undefined ? balances[index].toFixed(2) : 0.0}{" "}
            SOL
          </li>
        ))}
      </ul>
    </div>
  );
}

export const EthWallet = ({ mnemonic }) => {
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

  return (
    <div>
      <button
        onClick={async function () {
          if (!mnemonic) return; // Ensure mnemonic exists

          const seed = await mnemonicToSeed(mnemonic);
          const derivationPath = `m/44'/60'/${currentIndex}'/0'`;

          const hdNode = HDNodeWallet.fromSeed(seed);
          const child = hdNode.derivePath(derivationPath);
          const wallet = new Wallet(child.privateKey);
          setBalances(fetchBalance());
          setCurrentIndex(currentIndex + 1);
          setAddresses([...addresses, wallet.address]);
        }}
      >
        Add ETH Wallet
      </button>

      <h3>Ethereum Addresses:</h3>
      <ul>
        {addresses.map((p, index) => (
          <li key={index}>
            {p} Balance:{" "}
            {balances[index] !== undefined ? balances[index].toFixed(2) : 0.0}{" "}
            Eth
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
