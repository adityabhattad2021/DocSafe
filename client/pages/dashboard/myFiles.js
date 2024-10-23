import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "../../layout/layout";
import styles from "../../styles/MyFile.module.css";
import { animate, motion, useMotionValue, useScroll } from "framer-motion";
import { BsThreeDots } from "react-icons/bs";
import {
	Tag,
	TagLabel,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Heading,
	Text,
} from "@chakra-ui/react";
import { useStateContext } from "../../context";

export default function MyFiles() {
	const ref = useRef(null);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);
	const [trackMouse, setTrackMouse] = useState(false);
	const [animationComplete, setAnimationComplete] = useState(true);
	const [files, setFiles] = useState([]);
	const { address, addAllowed, fetchUserSafes } = useStateContext();

	useEffect(() => {
		if (address) {
			fetchUserSafes(address)
				.then((res) => {
					setFiles(res);
				})
				.catch((err) => {
					console.log("Error", err);
				});
		}
	}, []);


	const router = useRouter();
	const x = useMotionValue(0);

	const handleMouseMove = (e) => {
		if (!ref.current) return;
		if (!trackMouse) return;

		setAnimationComplete(false);

		const xVal = e.pageX - ref.current.offsetLeft;
		const walk = (xVal - startX) * 2; //scroll-fast

		const controls = animate(x, scrollLeft - walk, {
			type: "tween",
			ease: "easeOut",
			duration: 0,
			onUpdate: (val) => {
				if (!ref.current) return;
				ref.current.scrollLeft = val;
			},
			onComplete: () => {
				setAnimationComplete(true);
			},
			onStop: () => {
				setAnimationComplete(true);
			},
		});
		return controls.stop;
	};

	const handleMouseDown = (e) => {
		if (!ref.current) return;

		setTrackMouse(true);

		const startX = e.pageX - ref.current.offsetLeft;
		setStartX(startX);

		const scrollLeft = ref.current.scrollLeft;
		setScrollLeft(scrollLeft);
	};

	const handleMouseLeave = () => {
		setTrackMouse(false);
	};

	const handleMouseUp = () => {
		setTrackMouse(false);
	};

	const handleScroll = () => {
		if (!ref.current) return;

		if (animationComplete) {
			x.set(ref.current.scrollLeft);
		}
	};

	// const openMediaFileHandler = (cid, filename) => {
	// 	router.push(`/view-media/${cid}?filename=${filename}`);
	// };

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
				<div className={styles.greetHolder}>
					<h1 className={styles.welcome}>Welcome!</h1>
					<h3 className={styles.username}>{address}</h3>
				</div>
				<div className={styles.myFilesContainer}>
					<h1 className={styles.title} style={{ paddingTop: "20px" }}>My files</h1>
					<Text
						color="white"
						paddingLeft="30px"
						fontSize={22}
						marginBottom={10}
					>
						Files that you have added will be displayed here.
					</Text>
					<motion.div
						className={styles.myFileHolderParent}
						whileTap={{ cursor: "grabbing" }}
						ref={ref}
						onMouseMove={handleMouseMove}
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseLeave}
						onScroll={handleScroll}
					>
						{files?.length > 0 ? (
							files.map((item, index) => {

								return (
									<motion.div
										key={index}
										className={styles.filebox}
										style={{
											userSelect: trackMouse
												? "none"
												: "auto",
										}}
									>
										<div
											className={
												styles.fileTextHolder
											}
										>
											<Tag
												size="lg"
												borderRadius="full"
												variant="solid"
												bg="transparent"
												color="white"
											>
												<TagLabel>
													{item.name}
												</TagLabel>
											</Tag>
											<Menu>
												<MenuButton>
													<BsThreeDots color="white" />
												</MenuButton>
												<MenuList>
													<MenuItem
														onClick={() =>
															viewFileHandler(
																item.cid,
																item.name
															)
														}
													>
														View
													</MenuItem>
													<MenuItem>
														Share
													</MenuItem>
												</MenuList>
											</Menu>
										</div>
									</motion.div>
								);

							})
						) : (
							<Heading color="white">No files found</Heading>
						)}
					</motion.div>
				</div>
			</div>
		</Layout>
	);
}
