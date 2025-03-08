// src/app/services/contractService.ts
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

// Example ABI for your verification contract - replace with your actual contract ABI
const contractABI = [
  // Example function for verifying token distribution
  {
    "inputs": [
      {"name": "rewardAddress", "type": "address"},
      {"name": "verifyAddress", "type": "address"},
      {"name": "tokenAddresses", "type": "address[]"},
      {"name": "percentages", "type": "uint256[]"},
      {"name": "timestamp", "type": "uint256"}
    ],
    "name": "verifyDistribution",
    "outputs": [{"name": "success", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Replace with your actual contract address
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

export interface TokenMapping {
  tokenAddress: string;
  percentage: number;
}

export async function submitVerification(
  rewardAddress: string,
  verifyAddress: string,
  tokenMappings: TokenMapping[],
  timestamp: number
): Promise<boolean> {
  try {
    // Connect to Ethereum provider - in production use a proper provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Request account access
    await provider.send("eth_requestAccounts", []);
    
    // Get the signer
    const signer = provider.getSigner();
    
    // Connect to the contract
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, await signer);
    
    // Prepare arrays for the contract call
    const tokenAddresses = tokenMappings.map(mapping => mapping.tokenAddress);
    const percentages = tokenMappings.map(mapping => ethers.parseUnits(mapping.percentage.toString(), 2)); // Convert percentages to basis points
    
    // Call the contract
    const tx = await contract.verifyDistribution(
      rewardAddress,
      verifyAddress,
      tokenAddresses,
      percentages,
      timestamp
    );
    
    // Wait for transaction to be mined
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error("Error submitting verification:", error);
    throw error;
  }
}