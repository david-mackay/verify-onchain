'use client';

import { useState, useEffect } from 'react';
import { ethers, Eip1193Provider } from 'ethers';
import { CheckCircleIcon, ClockIcon } from 'lucide-react';

const CONTRACT_ADDRESS = "0x1Ec235203D71544C279085407F4171a3EAFce3a8";
const FINDER_ADDRESS = "0xf4C48eDAd256326086AEfbd1A53e1896815F8f13"; 
const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_finderAddress","type":"address"},{"internalType":"address","name":"_currency","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"assertionId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":true,"internalType":"address","name":"asserter","type":"address"}],"name":"AssertionMade","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"TaskCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"taskId","type":"uint256"},{"indexed":true,"internalType":"address","name":"asserter","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"TaskSettled","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"assertions","outputs":[{"internalType":"address","name":"asserter","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes","name":"ancillaryData","type":"bytes"},{"internalType":"int256","name":"assertedValue","type":"int256"},{"internalType":"uint256","name":"taskId","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"createTask","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currency","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"finder","outputs":[{"internalType":"contract FinderInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllTasks","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"string[]","name":"","type":"string[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bool[]","name":"","type":"bool[]"},{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"taskId","type":"uint256"}],"name":"getTask","outputs":[{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"reward","type":"uint256"},{"internalType":"bool","name":"completed","type":"bool"},{"internalType":"address","name":"creator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"taskId","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes","name":"ancillaryData","type":"bytes"},{"internalType":"int256","name":"assertedValue","type":"int256"},{"internalType":"uint256","name":"bond","type":"uint256"},{"internalType":"uint64","name":"liveness","type":"uint64"}],"name":"makeAssertion","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nextAssertionId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextTaskId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oo","outputs":[{"internalType":"contract OptimisticOracleV2Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priceIdentifier","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assertionId","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes","name":"ancillaryData","type":"bytes"}],"name":"settleAndGetResult","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tasks","outputs":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"reward","type":"uint256"},{"internalType":"bool","name":"completed","type":"bool"}],"stateMutability":"view","type":"function"}]; 
const FINDER_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"interfaceName","type":"bytes32"},{"indexed":true,"internalType":"address","name":"newImplementationAddress","type":"address"}],"name":"InterfaceImplementationChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"bytes32","name":"interfaceName","type":"bytes32"},{"internalType":"address","name":"implementationAddress","type":"address"}],"name":"changeImplementationAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"interfaceName","type":"bytes32"}],"name":"getImplementationAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"interfacesImplemented","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const STORE_ABI = [{"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"_fixedOracleFeePerSecondPerPfc","type":"tuple"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"_weeklyDelayFeePerSecondPerPfc","type":"tuple"},{"internalType":"address","name":"_timerAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roleId","type":"uint256"},{"indexed":true,"internalType":"address","name":"newMember","type":"address"},{"indexed":true,"internalType":"address","name":"manager","type":"address"}],"name":"AddedSharedMember","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"indexed":false,"internalType":"struct FixedPoint.Unsigned","name":"newFinalFee","type":"tuple"}],"name":"NewFinalFee","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"indexed":false,"internalType":"struct FixedPoint.Unsigned","name":"newOracleFee","type":"tuple"}],"name":"NewFixedOracleFeePerSecondPerPfc","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"indexed":false,"internalType":"struct FixedPoint.Unsigned","name":"newWeeklyDelayFeePerSecondPerPfc","type":"tuple"}],"name":"NewWeeklyDelayFeePerSecondPerPfc","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roleId","type":"uint256"},{"indexed":true,"internalType":"address","name":"oldMember","type":"address"},{"indexed":true,"internalType":"address","name":"manager","type":"address"}],"name":"RemovedSharedMember","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roleId","type":"uint256"},{"indexed":true,"internalType":"address","name":"newMember","type":"address"},{"indexed":true,"internalType":"address","name":"manager","type":"address"}],"name":"ResetExclusiveMember","type":"event"},{"inputs":[],"name":"SECONDS_PER_WEEK","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"},{"internalType":"address","name":"newMember","type":"address"}],"name":"addMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"currency","type":"address"}],"name":"computeFinalFee","outputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"pfc","type":"tuple"}],"name":"computeRegularFee","outputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"regularFee","type":"tuple"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"latePenalty","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"finalFees","outputs":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fixedOracleFeePerSecondPerPfc","outputs":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"}],"name":"getMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"},{"internalType":"address","name":"memberToCheck","type":"address"}],"name":"holdsRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"payOracleFees","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"erc20Address","type":"address"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"amount","type":"tuple"}],"name":"payOracleFeesErc20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"},{"internalType":"address","name":"memberToRemove","type":"address"}],"name":"removeMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"}],"name":"renounceMembership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roleId","type":"uint256"},{"internalType":"address","name":"newMember","type":"address"}],"name":"resetMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setCurrentTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"currency","type":"address"},{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"newFinalFee","type":"tuple"}],"name":"setFinalFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"newFixedOracleFeePerSecondPerPfc","type":"tuple"}],"name":"setFixedOracleFeePerSecondPerPfc","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"internalType":"struct FixedPoint.Unsigned","name":"newWeeklyDelayFeePerSecondPerPfc","type":"tuple"}],"name":"setWeeklyDelayFeePerSecondPerPfc","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"timerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"weeklyDelayFeePerSecondPerPfc","outputs":[{"internalType":"uint256","name":"rawValue","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"erc20Address","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawErc20","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const CURRENCY_ABI = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]; 

declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }
}

interface Task {
  id: number;
  description: string;
  reward: string;
  status: 'available' | 'pending' | 'completed';
  creator: string;
}

const TaskClaimSystem = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [rewardAddress, setRewardAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskReward, setNewTaskReward] = useState<string>('');
  const [currencyDecimals, setCurrencyDecimals] = useState<number>(6); // USDC default decimals
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

  const fetchTasks = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      // Call the getAllTasks function from the updated contract
      const [ids, descriptions, rewards, completed, creators] = await contract.getAllTasks();
      
      const fetchedTasks: Task[] = [];
      for (let i = 0; i < ids.length; i++) {
        fetchedTasks.push({
          id: parseInt(ids[i]),
          description: descriptions[i],
          reward: ethers.formatUnits(rewards[i], currencyDecimals), // Format with USDC decimals
          status: completed[i] ? 'completed' : 'available',
          creator: creators[i]
        });
      }
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(`Error fetching tasks: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  useEffect(() => {
    fetchTasks();
    getCurrencyDecimals();
  }, [fetchTasks, getCurrencyDecimals]);



  const handleClaimTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!selectedTaskId) {
      setError('Please select a task first');
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

      const task = tasks.find(t => t.id === selectedTaskId);
      if (!task) throw new Error("Task not found");

      const ancillaryData = ethers.toUtf8Bytes(task.description);
      const YES_ANSWER = 1; // Using plain 1 value for success

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

      // Call the makeAssertion function with the task ID
      const assertionTx = await contract.makeAssertion(
        selectedTaskId, // Pass the task ID (not timestamp as the first parameter)
        requestTimestamp,
        ancillaryData,
        YES_ANSWER,
        bond,
        60
      );
      await assertionTx.wait();
      
      setSuccessMessage(`Task claimed successfully! You will receive an email at ${email} once verification is complete.`);
      setSelectedTaskId(null);
      fetchTasks();
    } catch (err) {
      setError(`Error submitting task claim: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newTaskDescription || !newTaskReward) {
      setError("Please provide both description and reward");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const rewardInWei = ethers.parseUnits(newTaskReward, currencyDecimals);

      const currencyAddress = await contract.currency();
      const currency = new ethers.Contract(currencyAddress, CURRENCY_ABI, signer);
      
      // First approve the contract to spend tokens
      const approval = await currency.approve(CONTRACT_ADDRESS, rewardInWei);
      await approval.wait();
      console.log("Approved");
      
      // Create the task with the approved tokens
      const tx = await contract.createTask(newTaskDescription, rewardInWei);
      await tx.wait();

      setSuccessMessage("Task created successfully!");
      setNewTaskDescription('');
      setNewTaskReward('');
      fetchTasks();
    } catch (err) {
      setError(`Error creating task: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-black">
      <h1 className="text-2xl font-bold mb-6 text-black">Task Claiming Portal</h1>

      <h2 className="text-lg font-semibold mb-4 text-black">Available Tasks</h2>
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              isSelected={selectedTaskId === task.id}
              isDisabled={task.status !== 'available'}
              onSelect={() => handleClaimTask(task.id)}
            />
          ))
        ) : (
          <p className="text-gray-500">No tasks available.</p>
        )}
      </div>

      {selectedTaskId !== null && (
        <div className="mt-6 p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-4 text-black">Claim Task</h2>
          <form onSubmit={handleSubmitClaim} className="space-y-4">
            <input 
              type="email" 
              placeholder="Your Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full text-black border border-black p-2 rounded"
            />
            <input 
              type="text" 
              placeholder="ETH Address for Reward" 
              value={rewardAddress} 
              onChange={(e) => setRewardAddress(e.target.value)} 
              required 
              className="w-full text-black border border-black p-2 rounded"
            />
            <button 
              type="submit" 
              className="w-full bg-black text-white py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </form>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4 text-black mt-6">Create a New Task</h2>
      <form onSubmit={handleCreateTask} className="space-y-4">
        <input 
          type="text" 
          placeholder="Task Description" 
          value={newTaskDescription} 
          onChange={(e) => setNewTaskDescription(e.target.value)} 
          required 
          className="w-full text-black border border-black p-2 rounded"
        />
        <input 
          type="text" 
          placeholder="Reward (USDC)" 
          value={newTaskReward} 
          onChange={(e) => setNewTaskReward(e.target.value)} 
          required 
          className="w-full border text-black border-black p-2 rounded"
        />
        <button type="submit" className="w-full bg-black text-white py-2 rounded">Create Task</button>
      </form>

      {error && <div className="mt-4 p-2 bg-red-100 text-red-600 rounded">{error}</div>}
      {successMessage && <div className="mt-4 p-2 bg-green-100 text-green-600 rounded">{successMessage}</div>}
    </div>
  );
};

// Task Item Component
const TaskItem = ({ task, isSelected, isDisabled, onSelect }: { 
  task: Task, 
  isSelected: boolean, 
  isDisabled: boolean, 
  onSelect: () => void 
}) => (
  <div 
    className={`p-4 border rounded-md ${!isDisabled ? 'cursor-pointer' : ''} ${
      isDisabled ? 'bg-gray-200' : isSelected ? 'border-black bg-gray-100' : 'hover:border-black'
    }`}
    onClick={!isDisabled ? onSelect : undefined}
  >
    <div className="flex justify-between">
      <h3 className="font-medium text-black">{task.description}</h3>
      <div className="flex items-center">
        {task.status === 'completed' ? (
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
        ) : task.status === 'pending' ? (
          <ClockIcon className="h-5 w-5 text-yellow-500" />
        ) : null}
      </div>
    </div>
    <p className="text-sm text-black mt-1">Reward: {task.reward} USDC</p>
    <p className="text-xs text-gray-500 mt-1">Created by: {formatAddress(task.creator)}</p>
  </div>
);

// Helper function to format addresses
const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export default TaskClaimSystem;