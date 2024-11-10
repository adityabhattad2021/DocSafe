import React, { useState, useEffect } from 'react';
import Layout from "../../layout/layout";
import styles from "../../styles/NFTManagement.module.css";
import { useStateContext } from "../../context";
import { 
    Tabs, TabList, TabPanels, Tab, TabPanel,
    FormControl, FormLabel, Input, Button,
    Tag, TagLabel, TagCloseButton, Text,
    Select, useToast
} from "@chakra-ui/react";
import {
    writeContract,
    simulateContract,
    deployContract,
    waitForTransactionReceipt
} from '@wagmi/core';
import { useAccount } from 'wagmi';
import { wagmiAdapter } from "../../wagmi/config";

// Import your AccessNFT ABI
import AccessNFTABI from "../../artifacts/contracts/AccessNFT.sol/AccessNFT.json";

export default function NFTManagement() {
    const { address, fetchUserSafes, addAccessNFT } = useStateContext();
    const { isConnected } = useAccount();
    
    const [tabIndex, setTabIndex] = useState(0);
    const [nftName, setNftName] = useState("");
    const [nftSymbol, setNftSymbol] = useState("");
    const [mintAddresses, setMintAddresses] = useState([]);
    const [selectedSafe, setSelectedSafe] = useState("");
    const [nftAddress, setNftAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [safes, setSafes] = useState([]);
    
    const toast = useToast();
    const wagmiConfig = wagmiAdapter.wagmiConfig;

    useEffect(() => {
        if (isConnected && address) {
            loadUserSafes();
        }
    }, [isConnected, address]);

    const loadUserSafes = async () => {
        try {
            const userSafes = await fetchUserSafes(address);
            setSafes(userSafes);
        } catch (error) {
            console.error("Error loading safes:", error);
            toast({
                title: "Error loading safes",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleAddMintAddress = (e) => {
        if (e.key === "Enter" && e.target.value) {
            // Basic Ethereum address validation
            const addressRegex = /^0x[a-fA-F0-9]{40}$/;
            if (!addressRegex.test(e.target.value)) {
                toast({
                    title: "Invalid Address",
                    description: "Please enter a valid Ethereum address",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
            setMintAddresses([...mintAddresses, e.target.value]);
            e.target.value = "";
        }
    };

    const removeMintAddress = (address) => {
        setMintAddresses(mintAddresses.filter((a) => a !== address));
    };

    const handleCreateNFT = async () => {
        if (!isConnected) {
            toast({
                title: "Please connect your wallet",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        try {
            // Deploy new AccessNFT contract
            const receipt = await deployContract(wagmiConfig, {
                abi: AccessNFTABI.abi,
                bytecode: AccessNFTABI.bytecode,
                args: [],
            });

            const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
                hash: receipt,
              })
            
            const nftContractAddress = transactionReceipt.contractAddress;
            console.log(transactionReceipt)
            toast({
                title: "NFT Created Successfully",
                description: `Contract deployed at ${nftContractAddress}`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Mint NFTs to all addresses
            for (const mintAddress of mintAddresses) {
                const { request: mintRequest } = await simulateContract(wagmiConfig, {
                    address: nftContractAddress,
                    abi: AccessNFTABI.abi,
                    functionName: 'safeMint',
                    args: [mintAddress],
                });
                
                await writeContract(wagmiConfig, mintRequest);
            }

            toast({
                title: "NFT Minted Successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Clear form
            setNftName("");
            setNftSymbol("");
            setMintAddresses([]);
            
        } catch (error) {
            console.error("Error creating NFT:", error);
            toast({
                title: "Error creating NFT",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    };

    const handleGrantAccess = async () => {
        if (!isConnected) {
            toast({
                title: "Please connect your wallet",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!selectedSafe || !nftAddress) {
            toast({
                title: "Missing Information",
                description: "Please select a safe and enter NFT address",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        try {
            const hash = await addAccessNFT(selectedSafe, nftAddress);

            toast({
                title: "Access Granted Successfully",
                description: "NFT holders can now access the safe",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Clear form
            setSelectedSafe("");
            setNftAddress("");
            
        } catch (error) {
            console.error("Error granting access:", error);
            toast({
                title: "Error granting access",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    };

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.tabHolder}>
                    <Tabs
                        index={tabIndex}
                        onChange={setTabIndex}
                        variant="soft-rounded"
                        colorScheme="brand"
                        size="lg"
                        align="center"
                        isFitted
                    >
                        <TabList>
                            <Tab color="white">Create NFT</Tab>
                            <Tab color="white">Grant Safe Access</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <div className={styles.formHolder}>
                                    <FormControl isRequired>
                                        <FormLabel color="white">NFT Name</FormLabel>
                                        <Input
                                            className={styles.inputField}
                                            placeholder="Enter NFT collection name"
                                            size="lg"
                                            value={nftName}
                                            onChange={(e) => setNftName(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel color="white">NFT Symbol</FormLabel>
                                        <Input
                                            className={styles.inputField}
                                            placeholder="Enter NFT symbol (e.g. SAFE)"
                                            size="lg"
                                            value={nftSymbol}
                                            onChange={(e) => setNftSymbol(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel color="white">Mint Addresses</FormLabel>
                                        <Input
                                            className={styles.inputField}
                                            placeholder="Enter Ethereum address and press enter"
                                            size="lg"
                                            onKeyDown={handleAddMintAddress}
                                        />
                                    </FormControl>

                                    {mintAddresses.length > 0 ? (
                                        <div className={styles.addressesHolder}>
                                            {mintAddresses.map((address) => (
                                                <Tag
                                                    key={address}
                                                    size="lg"
                                                    borderRadius="full"
                                                    variant="solid"
                                                    bg="brand.100"
                                                >
                                                    <TagLabel>{address}</TagLabel>
                                                    <TagCloseButton
                                                        onClick={() => removeMintAddress(address)}
                                                    />
                                                </Tag>
                                            ))}
                                        </div>
                                    ) : (
                                        <Text color="white" fontSize="1.3rem">
                                            Please add addresses to mint NFTs
                                        </Text>
                                    )}

                                    <Button
                                        className={styles.actionButton}
                                        onClick={handleCreateNFT}
                                        isLoading={isLoading}
                                        isDisabled={!mintAddresses.length || !nftName || !nftSymbol}
                                    >
                                        Create NFT
                                    </Button>
                                </div>
                            </TabPanel>

                            <TabPanel>
                                <div className={styles.formHolder}>
                                    <FormControl isRequired>
                                        <FormLabel color="white">NFT Contract Address</FormLabel>
                                        <Input
                                            className={styles.inputField}
                                            placeholder="Enter NFT contract address"
                                            size="lg"
                                            value={nftAddress}
                                            onChange={(e) => setNftAddress(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel color="white">Select Safe</FormLabel>
                                        <Select
                                            className={styles.selectField}
                                            placeholder="Choose a safe"
                                            size="lg"
                                            value={selectedSafe}
                                            onChange={(e) => setSelectedSafe(e.target.value)}
                                        >
                                            {safes.map((safe) => (
                                                <option key={safe.name} value={safe.name}>
                                                    {safe.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Button
                                        className={styles.actionButton}
                                        onClick={handleGrantAccess}
                                        isLoading={isLoading}
                                        isDisabled={!selectedSafe || !nftAddress}
                                    >
                                        Grant Access
                                    </Button>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
}