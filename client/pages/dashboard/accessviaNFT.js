import Layout from "../../layout/layout";
import styles from "../../styles/AccessViaNFT.module.css";
import { useStateContext } from "../../context";
import { BsThreeDots } from "react-icons/bs";
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Tag,
    TagLabel,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Box,
    Heading,
    useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AccessViaNFT() {
    const { fetchSafesForNFT } = useStateContext();
    const [nft, setNFT] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [safes, setSafes] = useState([]);
    const router = useRouter();

    async function handleSubmit(nftAddress) {
        try {
            setIsLoading(true);
            const safeA = await fetchSafesForNFT(nftAddress);
            setSafes(safeA);
        } catch (error) {
            console.error("Error fetching safes:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const viewFileHandler = (cid, filename) => {
        const ipfsMatch = cid.match(/ipfs:\/\/([^/]+)\/(.+)/);
        const formattedCid = ipfsMatch 
            ? `${ipfsMatch[1]}/${ipfsMatch[2]}`
            : cid;
        const formattedFilename = encodeURIComponent(filename);
        return openMediaFileHandler(formattedCid, formattedFilename);
    };
    
    const openMediaFileHandler = (cid, filename) => {
        router.push({
            pathname: '/view-media',
            query: { cid, filename }
        });
    };

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.formHolder}>
                    <Box className={styles.formSection}>
                        <Heading as="h1" size="lg" color="white" mb={4}>
                            Access NFT Files
                        </Heading>
                        <FormControl isRequired>
                            <FormLabel color="white">NFT Address</FormLabel>
                            <Input
                                placeholder="Enter the NFT address here..."
                                size="lg"
                                type="text"
                                value={nft}
                                onChange={(e) => setNFT(e.target.value)}
                                className={styles.formHolder}
                                _placeholder={{ color: "whiteAlpha.400" }}
                                borderColor="whiteAlpha.200"
                                _hover={{ borderColor: "whiteAlpha.300" }}
                                _focus={{ 
                                    borderColor: "whiteAlpha.400",
                                    boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.2)"
                                }}
                            />
                        </FormControl>
		                 <Button
                            onClick={() => handleSubmit(nft)}
                            isLoading={isLoading}
                            loadingText="Submitting"
                            spinnerPlacement="end"
                        >
                            Submit
                        </Button>
                    </Box>

                    {safes?.length > 0 && (
                        <Box className={styles.tableContainer}>
                            <TableContainer>
                                <Table variant="simple" className={styles.table}>
                                    <Thead className={styles.tableHeader}>
                                        <Tr>
                                            <Th color="white">File Name</Th>
                                            <Th color="white">Shared By</Th>
                                            <Th width="50px"></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {safes.map((item, index) => (
                                            <Tr key={index} className={styles.tableRow}>
                                                <Td>
                                                    <Tag
                                                        size="lg"
                                                        borderRadius="full"
                                                        variant="subtle"
                                                        bg="whiteAlpha.100"
                                                        color="white"
                                                    >
                                                        <TagLabel>{item.name}</TagLabel>
                                                    </Tag>
                                                </Td>
                                                <Td color="white">{item.owner || "—"}</Td>
                                                <Td>
                                                    <Menu>
                                                        <MenuButton
                                                            as={Button}
                                                            variant="ghost"
                                                            className={styles.menuButton}
                                                            p={2}
                                                            minW="auto"
                                                        >
                                                            <BsThreeDots color="white" />
                                                        </MenuButton>
                                                        <MenuList
                                                            bg="gray.800"
                                                            borderColor="whiteAlpha.200"
                                                        >
                                                            <MenuItem
                                                                onClick={() => viewFileHandler(item.cid, item.name)}
                                                                _hover={{ bg: "whiteAlpha.100" }}
                                                            >
                                                                View
                                                            </MenuItem>
                                                            <MenuItem
                                                                _hover={{ bg: "whiteAlpha.100" }}
                                                            >
                                                                Share
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </div>
            </div>
        </Layout>
    );
}