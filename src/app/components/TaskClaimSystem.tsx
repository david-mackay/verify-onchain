'use client';

import { useState, useEffect } from 'react';
import { ethers, Eip1193Provider } from 'ethers';
import { CheckCircleIcon, ClockIcon, CoinsIcon } from 'lucide-react';

const CONTRACT_ADDRESS = "0x9734Dd9b7fA3609F2D790EAF8BcFBBcA185bBA24";
const FINDER_ADDRESS = "0xf4C48eDAd256326086AEfbd1A53e1896815F8f13"; 
const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_finderAddress","type":"address"},{"internalType":"address","name":"_currency","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes","name":"ancillaryData","type":"bytes"},{"internalType":"int256","name":"assertedValue","type":"int256"}],"name":"assertAndRatify","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"asserters","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currency","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes","name":"ancillaryData","type":"bytes"},{"internalType":"int256","name":"assertedValue","type":"int256"}],"name":"disperseRewards","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"finder","outputs":[{"internalType":"contract FinderInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes","name":"ancillaryData","type":"bytes"}],"name":"getResult","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes","name":"ancillaryData","type":"bytes"},{"internalType":"int256","name":"assertedValue","type":"int256"},{"internalType":"uint256","name":"bond","type":"uint256"},{"internalType":"uint64","name":"liveness","type":"uint64"}],"name":"makeAssertion","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"oo","outputs":[{"internalType":"contract OptimisticOracleV2Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priceIdentifier","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes","name":"ancillaryData","type":"bytes"}],"name":"ratifyAssertion","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"rewardedAssertions","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes","name":"ancillaryData","type":"bytes"}],"name":"settleAndGetResult","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"}];
const FINDER_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"interfaceName","type":"bytes32"},{"indexed":true,"internalType":"address","name":"newImplementationAddress","type":"address"}],"name":"InterfaceImplementationChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"bytes32","name":"interfaceName","type":"bytes32"},{"internalType":"address","name":"implementationAddress","type":"address"}],"name":"changeImplementationAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"interfaceName","type":"bytes32"}],"name":"getImplementationAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"interfacesImplemented","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const STORE_ABI = [{"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"_fixedOracleFeePerSecondPerPfc","type":"tuple"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"_weeklyDelayFeePerSecondPerPfc","type":"tuple"},{"internalType":"address","name":"_timerAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roleId","type":"uint256"},{"indexed":true,"internalType":"address","name":"newMember","type":"address"},{"indexed":true,"internalType":"address","name":"manager","type":"address"}],"name":"AddedSharedMember","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"indexed":false,"internalType":"struct FixedPoint.Unsigned","name":"newFinalFee","type":"tuple"}],"name":"NewFinalFee","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"indexed":false,"internalType":"struct FixedPoint.Unsigned","name":"newOracleFee","type":"tuple"}],"name":"NewFixedOracleFeePerSecondPerPfc","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"indexed":false,"internalType":"struct FixedPoint.Unsigned","name":"newWeeklyDelayFeePerSecondPerPfc","type":"tuple"}],"name":"NewWeeklyDelayFeePerSecondPerPfc","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roleId","type":"uint256"},{"indexed":true,"internalType":"address","name":"oldMember","type":"address"},{"indexed":true,"internalType":"address","name":"manager","type":"address"}],"name":"RemovedSharedMember","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roleId","type":"uint256"},{"indexed":true,"internalType":"address","name":"newMember","type":"address"},{"indexed":true,"internalType":"address","name":"manager","type":"address"}],"name":"ResetExclusiveMember","type":"event"},{"inputs":[],"name":"SECONDS_PER_WEEK","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"},{"internalType":"address","name":"newMember","type":"address"}],"name":"addMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"currency","type":"address"}],"name":"computeFinalFee","outputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"pfc","type":"tuple"}],"name":"computeRegularFee","outputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"regularFee","type":"tuple"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"latePenalty","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"finalFees","outputs":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fixedOracleFeePerSecondPerPfc","outputs":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"}],"name":"getMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"},{"internalType":"address","name":"memberToCheck","type":"address"}],"name":"holdsRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"payOracleFees","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"erc20Address","type":"address"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"amount","type":"tuple"}],"name":"payOracleFeesErc20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"},{"internalType":"address","name":"memberToRemove","type":"address"}],"name":"removeMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"}],"name":"renounceMembership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"},{"internalType":"address","name":"newMember","type":"address"}],"name":"resetMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setCurrentTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"currency","type":"address"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"newFinalFee","type":"tuple"}],"name":"setFinalFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"newFixedOracleFeePerSecondPerPfc","type":"tuple"}],"name":"setFixedOracleFeePerSecondPerPfc","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"newWeeklyDelayFeePerSecondPerPfc","type":"tuple"}],"name":"setWeeklyDelayFeePerSecondPerPfc","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"timerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"weeklyDelayFeePerSecondPerPfc","outputs":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"erc20Address","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawErc20","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const CURRENCY_ABI = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]; 


declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }
}

interface Assertion {
  id: string;
  timestamp: number;
  ancillaryData: string;
  rawAncillaryData: Uint8Array;
  assertedValue: number;
  status: 'pending' | 'resolved' | 'rewarded';
  email?: string;
}

const OptimisticArbitratorApp = () => {
  // State variables
  const [assertions, setAssertions] = useState<Assertion[]>([]);
  const [assertionText, setAssertionText] = useState<string>('');
  const [assertedValue, setAssertedValue] = useState<number>(1); // Default to "Yes" (1)
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSettling, setIsSettling] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currencyDecimals, setCurrencyDecimals] = useState<number>(6); // USDC default decimals

  // Get currency decimals
  const getCurrencyDecimals = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const currencyAddress = await contract.currency();
      const currency = new ethers.Contract(currencyAddress, CURRENCY_ABI, provider);
      const decimals = await currency.decimals();
      setCurrencyDecimals(decimals);
    } catch (err) {
      console.error("Error fetching currency decimals:", err);
    }
  };

  // Fetch user's assertions
  const fetchAssertions = async () => {
    try {
      // Try to load from localStorage first
      const savedAssertions = localStorage.getItem('userAssertions');
      const localAssertions = savedAssertions ? JSON.parse(savedAssertions) : [];
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // Update status of local assertions
      const updatedAssertions: Assertion[] = [];
      
      for (const assertion of localAssertions) {
        try {
          // Convert from stored format back to usable format
          const rawData = assertion.rawAncillaryData 
            ? new Uint8Array(Object.values(assertion.rawAncillaryData)) 
            : ethers.toUtf8Bytes(assertion.ancillaryData);
          
          // Check status
          let status: 'pending' | 'resolved' | 'rewarded' = 'pending';
          
          try {
            // This will throw if not resolved
            await contract.getResult(assertion.timestamp, rawData);
            
            // If it doesn't throw, it's resolved
            status = 'resolved';
            
            // Check if rewarded
            const assertionKey = ethers.keccak256(
              ethers.solidityPacked(['uint256', 'bytes'], [assertion.timestamp, rawData])
            );
            
            const isRewarded = await contract.rewardedAssertions(assertionKey);
            if (isRewarded) {
              status = 'rewarded';
            }
          } catch (error) {
            // If it throws, it's still pending
            status = 'pending';
            console.log(error);
          }
          
          updatedAssertions.push({
            ...assertion,
            status,
            rawAncillaryData: rawData
          });
        } catch (error) {
          // If there's an error processing this assertion, keep it as is
          updatedAssertions.push(assertion);
          console.log(error)
        }
      }
      
      setAssertions(updatedAssertions);
      
      // Save updated assertions back to localStorage
      localStorage.setItem('userAssertions', JSON.stringify(updatedAssertions));
      
    } catch (err) {
      console.error("Error fetching assertions:", err);
      setError(`Error fetching assertions: ${err instanceof Error ? err.message : String(err)}`);
      
      // Fallback to localStorage only
      const savedAssertions = localStorage.getItem('userAssertions');
      if (savedAssertions) {
        setAssertions(JSON.parse(savedAssertions));
      }
    }
  };
  
  // Initialize
  useEffect(() => {
    getCurrencyDecimals();
    fetchAssertions();
  }, []);

  // Submit a new assertion
  const handleSubmitAssertion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!assertionText) {
      setError("Please enter an assertion");
      return;
    }

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const finder = new ethers.Contract(FINDER_ADDRESS, FINDER_ABI, provider);

      const latestBlock = await provider.getBlock("latest");
      if (!latestBlock) throw new Error("Failed to fetch latest block");
      const requestTimestamp = latestBlock.timestamp;

      const ancillaryData = ethers.toUtf8Bytes(assertionText);

      const storeAddress = await finder.getImplementationAddress(ethers.encodeBytes32String("Store"));
      const store = new ethers.Contract(storeAddress, STORE_ABI, provider);

      const currencyAddress = await contract.currency();
      const currency = new ethers.Contract(currencyAddress, CURRENCY_ABI, signer);

      const finalFeeStruct = await store.computeFinalFee(currencyAddress);
      const finalFee = finalFeeStruct.rawValue;

      const bond = ethers.parseUnits("1000", currencyDecimals);
      const totalAmount = bond + finalFee;

      // Approve the contract to spend the currency
      const approval = await currency.approve(CONTRACT_ADDRESS, totalAmount);
      await approval.wait();

      // Call the makeAssertion function
      const assertionTx = await contract.makeAssertion(
        requestTimestamp,
        ancillaryData,
        assertedValue,
        bond,
        60 // 60 seconds liveness for testing
      );
      const receipt = await assertionTx.wait();
      
      // Generate unique ID for local storage
      const timestamp = Date.now();
      const newId = `local-${timestamp}`;
      
      // Create new assertion object
      const newAssertion: Assertion = {
        id: newId,
        timestamp: requestTimestamp,
        ancillaryData: assertionText,
        rawAncillaryData: ancillaryData,
        assertedValue: assertedValue,
        status: 'pending',
        email: email
      };
      
      // Update assertions array
      const updatedAssertions = [...assertions, newAssertion];
      setAssertions(updatedAssertions);
      
      // Save to localStorage
      localStorage.setItem('userAssertions', JSON.stringify(updatedAssertions));
      
      // Submit to endpoint
      try {
        const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || '/api/assertions';
        
        const userAddress = await signer.getAddress();
        
        await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            assertionText: assertionText,
            assertedValue: assertedValue,
            timestamp: requestTimestamp,
            userAddress: userAddress,
            transactionHash: receipt.hash,
            chainId: (await provider.getNetwork()).chainId.toString()
          }),
        });
      } catch (apiError) {
        console.error("Failed to submit to API, but blockchain transaction was successful:", apiError);
        // We don't set an error here as the blockchain transaction was successful
      }
      
      setSuccessMessage(`Assertion submitted successfully!`);
      setAssertionText('');
      setEmail('');
    } catch (err) {
      setError(`Error submitting assertion: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Settle an assertion
  const handleSettleAssertion = async (assertion: Assertion) => {
    setIsSettling(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const settleTx = await contract.settleAndGetResult(
        assertion.timestamp,
        assertion.rawAncillaryData
      );
      await settleTx.wait();
      
      // Update assertion status in local state
      const updatedAssertions = assertions.map(a => {
        if (a.id === assertion.id) {
          return { ...a, status: 'resolved' as const };
        }
        return a;
      });
      
      setAssertions(updatedAssertions);
      
      // Update localStorage
      localStorage.setItem('userAssertions', JSON.stringify(updatedAssertions));
      
      setSuccessMessage(`Assertion settled successfully!`);
    } catch (err) {
      setError(`Error settling assertion: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSettling(false);
    }
  };

  // Claim reward for a correct assertion
  const handleClaimReward = async (assertion: Assertion) => {
    setIsClaiming(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const claimTx = await contract.disperseRewards(
        assertion.timestamp,
        assertion.rawAncillaryData,
        assertion.assertedValue
      );
      await claimTx.wait();
      
      // Update assertion status in local state
      const updatedAssertions = assertions.map(a => {
        if (a.id === assertion.id) {
          return { ...a, status: 'rewarded' as const };
        }
        return a;
      });
      
      setAssertions(updatedAssertions);
      
      // Update localStorage
      localStorage.setItem('userAssertions', JSON.stringify(updatedAssertions));
      
      setSuccessMessage(`Reward claimed successfully!`);
    } catch (err) {
      setError(`Error claiming reward: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-black">
      <h1 className="text-2xl font-bold mb-6 text-black">Optimistic Arbitrator</h1>

      {/* Make Assertion Form */}
      <div className="mb-8 p-4 border rounded-md">
        <h2 className="text-lg font-semibold mb-4 text-black">Make an Assertion</h2>
        <form onSubmit={handleSubmitAssertion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Assertion Statement:</label>
            <textarea 
              value={assertionText} 
              onChange={(e) => setAssertionText(e.target.value)} 
              required 
              className="w-full text-black border border-black p-2 rounded h-24"
              placeholder="Enter your assertion here..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">Email Address:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full text-black border border-black p-2 rounded"
              placeholder="Your email for notifications"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">Assertion Value:</label>
            <select
              value={assertedValue}
              onChange={(e) => setAssertedValue(parseInt(e.target.value))}
              className="w-full text-black border border-black p-2 rounded"
            >
              <option value={1}>YES (True)</option>
              <option value={0}>NO (False)</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-black text-white py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assertion'}
          </button>
        </form>
      </div>

      {/* My Assertions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-black">My Assertions</h2>
        {assertions.length > 0 ? (
          <div className="space-y-4">
            {assertions.map(assertion => (
              <div key={assertion.id} className="p-4 border rounded-md">
                <div className="flex justify-between">
                  <h3 className="font-medium text-black">{assertion.ancillaryData}</h3>
                  <div className="flex items-center">
                    {assertion.status === 'pending' ? (
                      <span className="flex items-center text-yellow-500">
                        <ClockIcon className="h-5 w-5 mr-1" />
                        Pending
                      </span>
                    ) : assertion.status === 'resolved' ? (
                      <span className="flex items-center text-blue-500">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        Resolved
                      </span>
                    ) : (
                      <span className="flex items-center text-green-500">
                        <CoinsIcon className="h-5 w-5 mr-1" />
                        Rewarded
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-black mt-1">
                  Asserted: {assertion.assertedValue === 1 ? 'YES' : 'NO'}
                </p>
                
                <div className="mt-3 flex gap-2">
                  {assertion.status === 'pending' && (
                    <button 
                      onClick={() => handleSettleAssertion(assertion)}
                      disabled={isSettling}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      {isSettling ? 'Processing...' : 'Settle'}
                    </button>
                  )}
                  
                  {assertion.status === 'resolved' && (
                    <button 
                      onClick={() => handleClaimReward(assertion)}
                      disabled={isClaiming}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                    >
                      {isClaiming ? 'Claiming...' : 'Claim Reward'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No assertions yet.</p>
        )}
      </div>

      {error && <div className="mt-4 p-2 bg-red-100 text-red-600 rounded">{error}</div>}
      {successMessage && <div className="mt-4 p-2 bg-green-100 text-green-600 rounded">{successMessage}</div>}
    </div>
  );
};


export default OptimisticArbitratorApp;