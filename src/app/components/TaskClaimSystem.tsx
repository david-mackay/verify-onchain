'use client';

import { useState } from 'react';
import { ethers, Eip1193Provider } from 'ethers';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from 'lucide-react';
const CONTRACT_ADDRESS = "0x4522f172f34B33DcC3842512f963955d4Fa6bCa5";
const FINDER_ADDRESS = "0xf4C48eDAd256326086AEfbd1A53e1896815F8f13"; 
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_finderAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_currency",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "ancillaryData",
        "type": "bytes"
      },
      {
        "internalType": "int256",
        "name": "assertedValue",
        "type": "int256"
      }
    ],
    "name": "assertAndRatify",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currency",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "finder",
    "outputs": [
      {
        "internalType": "contract FinderInterface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "ancillaryData",
        "type": "bytes"
      }
    ],
    "name": "getResult",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "ancillaryData",
        "type": "bytes"
      },
      {
        "internalType": "int256",
        "name": "assertedValue",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "bond",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "liveness",
        "type": "uint64"
      }
    ],
    "name": "makeAssertion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oo",
    "outputs": [
      {
        "internalType": "contract OptimisticOracleV2Interface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceIdentifier",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "ancillaryData",
        "type": "bytes"
      }
    ],
    "name": "ratifyAssertion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "ancillaryData",
        "type": "bytes"
      }
    ],
    "name": "settleAndGetResult",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const FINDER_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"interfaceName","type":"bytes32"},{"indexed":true,"internalType":"address","name":"newImplementationAddress","type":"address"}],"name":"InterfaceImplementationChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"bytes32","name":"interfaceName","type":"bytes32"},{"internalType":"address","name":"implementationAddress","type":"address"}],"name":"changeImplementationAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"interfaceName","type":"bytes32"}],"name":"getImplementationAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"interfacesImplemented","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];


declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }
}
interface Task {
  id: number; 
  description: string;
  reward: number;
}

type TaskStatus = 'available' | 'pending' | 'completed' | 'failed';

interface ClaimedTask extends Task {
  status: TaskStatus;
  claimedAt?: Date;
}

const TaskClaimSystem = () => {
  const availableTasks: Task[] = [
    { id: 1, description: "Q:Wallet 0x830344e9E4de83e94452Ef8a021F0e45bd9EEB90 received 0.5 ETH and 100 USDT in the last 10 hours", reward: 0.5 },
  ];

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [rewardAddress, setRewardAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [claimedTasks, setClaimedTasks] = useState<ClaimedTask[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleClaimTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const finder = new ethers.Contract(
        FINDER_ADDRESS, // Finder address used in the deployment
        FINDER_ABI,
        provider
      );
      
      // Get timestamp from latest block
      const latestBlock = await provider.getBlock("latest");
      if (!latestBlock) throw new Error("Failed to fetch latest block");
      const requestTimestamp = latestBlock.timestamp;

      const ancillaryData = ethers.toUtf8Bytes(availableTasks.find(task => task.id === selectedTaskId)?.description || "");
      const YES_ANSWER = ethers.parseUnits("1", 18);

      // Fetching store contract
      const storeAddress = await finder.getImplementationAddress(ethers.encodeBytes32String("Store"));
      const store = new ethers.Contract(storeAddress, CONTRACT_ABI, provider);

      // Fetching currency contract
      const currencyAddress = await contract.currency();
      const currency = new ethers.Contract(currencyAddress, CONTRACT_ABI, signer);

      // Fetch final fee
      const finalFeeStruct = await store.computeFinalFee(currencyAddress);
      const finalFee = finalFeeStruct.rawValue;

      const bond = ethers.parseUnits("500", 18);
      const totalAmount = bond + finalFee;

      // Allocate and approve tokens
      await (await currency.allocateTo(await signer.getAddress(), totalAmount)).wait();
      await (await currency.approve(CONTRACT_ADDRESS, totalAmount)).wait();

      // Make assertion
      await (
        await contract.makeAssertion(requestTimestamp, ancillaryData, YES_ANSWER, bond, 60)
      ).wait();

      setClaimedTasks(prev => [...prev, { id: selectedTaskId, description: ethers.toUtf8String(ancillaryData), reward: 0.5, status: 'pending', claimedAt: new Date() }]);
      setSuccessMessage(`Task claimed successfully! You will receive an email at ${email} once verification is complete.`);
      setSelectedTaskId(null);
    } catch (err) {
      setError(`Error submitting task claim: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-black">
      <h1 className="text-2xl font-bold mb-6 text-black">Task Claiming Portal</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold mb-4 text-black">Available Tasks</h2>
          
          <div className="space-y-4">
            {availableTasks.map((task) => {
              const isTaskClaimed = claimedTasks.some(ct => ct.id === task.id);
              
              return (
                <TaskItem 
                  key={task.id}
                  task={task}
                  isSelected={selectedTaskId === task.id}
                  isDisabled={isTaskClaimed}
                  onSelect={() => handleClaimTask(task.id)}
                />
              );
            })}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-black">Claim Selected Task</h2>
          
          {selectedTaskId ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="rewardAddress" className="block text-sm font-medium text-black mb-1">
                  Your ETH Reward Address
                </label>
                <input
                  id="rewardAddress"
                  type="text"
                  value={rewardAddress}
                  onChange={(e) => setRewardAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                  Your Email for Notification
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              {error && (
                <div className="p-3 bg-white border border-black text-black rounded-md">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="p-3 bg-white border border-black text-black rounded-md">
                  {successMessage}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Processing...' : 'Claim This Task'}
              </button>
            </form>
          ) : (
            <div className="p-4 border border-black rounded-md text-black bg-white">
              Please select a task from the list to claim it.
            </div>
          )}
          
          {claimedTasks.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-black">Your Claimed Tasks</h2>
              <div className="space-y-4">
                {claimedTasks.map((task) => (
                  <div key={task.id} className="p-4 border border-black rounded-md bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-black">{task.description}</h3>
                        <p className="text-sm text-black">
                          Reward: {task.reward} ETH • Claimed: {task.claimedAt?.toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Task Item Component
interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isSelected, isDisabled, onSelect }) => {
  return (
    <div 
      className={`p-4 border rounded-md cursor-pointer transition ${
        isDisabled ? 'bg-gray-200 opacity-60 border-gray-400' : 
        isSelected ? 'border-black bg-gray-100' : 'hover:border-black border-gray-400'
      }`}
      onClick={isDisabled ? undefined : onSelect}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-black">{task.description}</h3>
          <p className="text-sm text-black mt-1">Reward: {task.reward} ETH</p>
        </div>
        {isDisabled && (
          <span className="text-sm bg-black text-white px-2 py-1 rounded">
            Claimed
          </span>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
interface StatusBadgeProps {
  status: TaskStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return (
        <span className="flex items-center text-black bg-gray-200 px-2 py-1 rounded text-sm border border-black">
          <ClockIcon className="w-4 h-4 mr-1" />
          Pending
        </span>
      );
    case 'completed':
      return (
        <span className="flex items-center text-white bg-black px-2 py-1 rounded text-sm">
          <CheckCircleIcon className="w-4 h-4 mr-1" />
          Completed
        </span>
      );
    case 'failed':
      return (
        <span className="flex items-center text-white bg-black px-2 py-1 rounded text-sm">
          <XCircleIcon className="w-4 h-4 mr-1" />
          Failed
        </span>
      );
    default:
      return null;
  }
};

export default TaskClaimSystem;