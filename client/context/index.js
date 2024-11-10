import { useContext, createContext } from "react";
import { useAccount } from "wagmi";
import {
    writeContract,
    readContract,
    simulateContract,
    waitForTransactionReceipt,
} from '@wagmi/core';
import { fileManagerAddress } from "../constants";
import ABI from "../artifacts/contracts/FileManager.sol/FileManager.json";
import { wagmiAdapter  } from "../wagmi/config";

const StateContext = createContext();

export function StateContextProvider({ children }) {
	const {address} = useAccount()
	const contractAddress = fileManagerAddress;
	const contractABI = ABI.abi;
	const wagmiConfig = wagmiAdapter.wagmiConfig

	async function createSafe(name, cid, fileNames) {
        try {
            console.log(name,cid,fileNames);
            
            const { request } = await simulateContract(wagmiConfig, {
                address: contractAddress,
                abi: contractABI,
                functionName: 'createSafe',
                args: [name, cid, fileNames],
            });
            
            const hash = await writeContract(wagmiConfig, request);
			console.log(hash,"Aasdasd");
			console.log('asdasdqeqwe2')
            return hash;
        } catch (err) {
            console.error("Error creating safe:", err);
            throw err;
        }
    }

    async function addAllowed(safeName, userAddress) {
        try {
            const { request } = await simulateContract(wagmiConfig, {
                address: contractAddress,
                abi: contractABI,
                functionName: 'addAllowed',
                args: [safeName, userAddress],
            });
            
            const hash = await writeContract(wagmiConfig, request);
			console.log(hash,"adsasdew2w");
            
            return hash;
        } catch (err) {
            console.error("Error adding allowed user:", err);
            throw err;
        }
    }

    async function removeAllowed(safeName, userAddress) {
        try {
            const { request } = await simulateContract(wagmiConfig, {
                address: contractAddress,
                abi: contractABI,
                functionName: 'removeAllowed',
                args: [safeName, userAddress],
            });
            
            const hash = await writeContract(wagmiConfig, request);
            
            return hash;
        } catch (err) {
            console.error("Error removing allowed user:", err);
            throw err;
        }
    }

    async function addAccessNFT(safeName, nftAddress) {
        try {
            const { request } = await simulateContract(wagmiConfig, {
                address: contractAddress,
                abi: contractABI,
                functionName: 'addAccessNFT',
                args: [safeName, nftAddress],
            });
            
            const hash = await writeContract(wagmiConfig, request);
            
            return hash;
        } catch (err) {
            console.error("Error adding NFT access:", err);
            throw err;
        }
    }

    async function deleteSafe(safeName) {
        try {
            const { request } = await simulateContract(wagmiConfig, {
                address: contractAddress,
                abi: contractABI,
                functionName: 'deleteSafe',
                args: [safeName],
            });
            
            const hash = await writeContract(wagmiConfig, request);
            
            return hash;
        } catch (err) {
            console.error("Error deleting safe:", err);
            throw err;
        }
    }

    async function deleteFileFromSafe(safeName, fileName) {
        try {
            const { request } = await simulateContract(wagmiConfig, {
                address: contractAddress,
                abi: contractABI,
                functionName: 'deleteFileFromSafe',
                args: [safeName, fileName],
            });
            
            const hash = await writeContract(wagmiConfig, request);
            
            return hash;
        } catch (err) {
            console.error("Error deleting file from safe:", err);
            throw err;
        }
    }

    async function fetchSafesForNFT(nftAddress) {
        try {
            const result = await readContract(wagmiConfig, {
                address: contractAddress,
                abi: contractABI,
                functionName: 'getSafesForNFT',
                args: [nftAddress],
            });
            return result;
        } catch (err) {
            console.error("Error fetching safes for NFT:", err);
            throw err;
        }
    }

    async function fetchUserSafes(userAddress) {
        try {
			console.log(userAddress)
			console.log(contractAddress)
            const result = await readContract(wagmiConfig, {
                address: contractAddress,
                abi: contractABI,
                functionName: 'getUserSafes',
                args: [userAddress],
            });
			console.log(result)
            return result;
        } catch (err) {
            console.error("Error fetching user safes:", err);
            throw err;
        }
    }

    async function fetchSafesSharedWithUser(userAddress) {
        try {
            const result = await readContract(wagmiConfig, {
                address: contractAddress,
                abi: contractABI,
                functionName: 'getSafesSharedWith',
                args: [userAddress],
            });
            return result;
        } catch (err) {
            console.error("Error fetching shared safes:", err);
            throw err;
        }
    }

	return (
		<StateContext.Provider
			value={{
				address,
				createSafe,
				addAllowed,
				removeAllowed,
                deleteSafe,
				deleteFileFromSafe,
				addAccessNFT,
				fetchUserSafes,
				fetchSafesSharedWithUser,
				fetchSafesForNFT,
			}}
		>
			{children}
		</StateContext.Provider>
	);
}

export function useStateContext() {
	return useContext(StateContext);
}
