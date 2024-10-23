import Layout from "../../layout/layout";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Text,
} from "@chakra-ui/react";
import styles from "../../styles/Shared.module.css";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context";
import { useRouter } from "next/router";


export default function SharedFiles() {
	const [fileList, setFileList] = useState([]);
	const { address, fetchSafesSharedWithUser } = useStateContext();
	const router = useRouter();

	useEffect(() => {
		console.log("Is this working!!")
		if (address) {
			fetchSafesSharedWithUser(address)
				.then((res) => {
					console.log(res);
					setFileList(res);
				})
				.catch((err) => {
					console.log("Error", err);
				});
		}
		
	}, []);


	const viewFileHandler = (cid, filename) => {
		// Extract the CID and suffix from ipfs://<cid>/<suffix> format
		const ipfsMatch = cid.match(/ipfs:\/\/([^/]+)\/(.+)/);
		const formattedCid = ipfsMatch 
			? `${ipfsMatch[1]}/${ipfsMatch[2]}` // Keep the full path: CID/suffix
			: cid;
		console.log("CID with suffix", formattedCid);
	
		const formattedFilename = encodeURIComponent(filename);
		console.log("Filename", formattedFilename);
	
		const mediaFileTypes = [
			"mp4",
			"jpeg",
			"jpg",
			"png",
			"gif",
			"webp",
			"svg",
		];
	
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
				<div className={styles.tableHolder}>
					<h1 className={styles.title}>Shared with me</h1>
					<Text
						color="white"
						paddingLeft="30px"
						fontSize={22}
						marginBottom={10}
					>
						Files that have been shared with you.
					</Text>
					<TableContainer marginX="2rem">
						<Table color="white" variant="simple" fontSize={25}>
							<Thead>
								<Tr>
									<Th
										fontSize={30}
										textTransform={"capitalize"}
										fontFamily={"sans-serif"}
										color="white"
									>
										File Name
									</Th>
									<Th
										fontSize={30}
										textTransform={"capitalize"}
										color="white"
									>
										Shared By
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								{fileList?.length > 0 &&
									fileList.map((item, index) => {

											return (
												<Tr
													key={index}
													onClick={() =>
														viewFileHandler(
															item.cid,
															item.name
														)
													}
													color="white"
													style={{'cursor':'pointer'}}
												>
													<Td color="white">
														{item.name}
													</Td>
													<Td color="white">
														{item.owner}
													</Td>
												</Tr>
											);
										
										<Tr key={index} color="white">
											<Td color="white">
												{item.name}
											</Td>
											<Td color="white">{item.owner}</Td>
										</Tr>;
									})}
							</Tbody>
						</Table>
					</TableContainer>
				</div>
			</div>
		</Layout>
	);
}
