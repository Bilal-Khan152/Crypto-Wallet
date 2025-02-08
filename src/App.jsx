import React, { useState } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch,
  TextField,
  Box,
} from "@mui/material";
import { generateMnemonic } from "bip39";
import { mnemonicToSeed } from "bip39"; // Import mnemonicToSeed
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import nacl from "tweetnacl";
import { Wallet, HDNodeWallet } from "ethers";

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Container maxWidth="md" className={isDarkMode ? "dark" : "light"}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CryptX
          </Typography>
          <Switch checked={isDarkMode} onChange={toggleDarkMode} />
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => setMnemonic(generateMnemonic())}
        >
          Create Seed Phrase
        </Button>
        <TextField
          fullWidth
          variant="outlined"
          value={mnemonic}
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <SolanaWallet mnemonic={mnemonic} />
        <EthWallet mnemonic={mnemonic} />
      </Box>
    </Container>
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

  const addSolanaWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    const publicKey = keypair.publicKey.toBase58();
    setPublicKeys([...publicKeys, publicKey]);
    const balance = await fetchBalance(publicKey);
    setBalances([...balances, balance]);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="outlined" onClick={addSolanaWallet}>
        Add Sol wallet
      </Button>
      {publicKeys.map((key, index) => (
        <Typography key={index}>
          Sol - {key}{" "}
          <span>
            Balance:{" "}
            {balances[index] !== undefined ? balances[index].toFixed(2) : 0.0}{" "}
            SOL
          </span>
        </Typography>
      ))}
    </Box>
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

  const addEthWallet = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = ` m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);
    const address = wallet.address;
    setAddresses([...addresses, address]);
    const balance = await fetchBalance(address);
    setBalances([...balances, balance]);
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="outlined" onClick={addEthWallet}>
        Add ETH wallet
      </Button>
      {addresses.map((address, index) => (
        <Typography key={index}>
          Eth - {address}{" "}
          <span>
            Balance:{" "}
            {balances[index] !== undefined ? balances[index].toFixed(2) : 0.0}{" "}
            ETH
          </span>
        </Typography>
      ))}
    </Box>
  );
};

export default App;
