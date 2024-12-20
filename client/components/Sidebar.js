import styles from "../styles/Sidebar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

import { Button, Image } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useEffect } from "react";

export default function Sidebar() {
	const {address} = useAccount();

	const router = useRouter();
	const path = router.asPath.split("/").pop();

	return (
		<div className={styles.container}>
			<div>
				<div className={styles.title}>
					<Image width="4rem" src="/favicon.ico" marginRight={2}/>
					DocSafe
				</div>
				<div className={styles.linkContainer}>
					<div className={styles.dashboardTitleHolder}>
						<h1 className={styles.dashboardTitle}>Dashboard</h1>
					</div>
					<div className={styles.linksBox}>
						<div className={styles.bar}>.</div>
						<div className={styles.linkHolder}>
							<Link href="/dashboard/myFiles">
								<div
									className={
										path === "myFiles"
											? styles.selectedLink
											: styles.link
									}
								>
									My Files
								</div>
							</Link>

							<Link href="/dashboard/sharedFiles">
								<div
									className={
										path === "sharedFiles"
											? styles.selectedLink
											: styles.link
									}
								>
									Shared with me
								</div>
							</Link>

							<Link href="/dashboard/accessviaNFT">
								<div
									className={
										path === "accessviaNFT"
											? styles.selectedLink
											: styles.link
									}
								>
									Access via NFT
								</div>
							</Link>
							<Link href="/dashboard/nftManagement">
								<div
									className={
										path === "nftManagement"
											? styles.selectedLink
											: styles.link
									}
								>
									NFT Management
								</div>
							</Link>

							<Link href="/dashboard/create">
								<div
									className={
										path === "create"
											? styles.selectedLink
											: styles.link
									}
								>
									Add new files
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.profileContainer}>
				<div className={styles.profile}>
					<div className={styles.profileIcon}></div>
					<div className={styles.profileName}>{address?.substring(0,10)+"..."}</div>
				</div>
				<div className={styles.logout}>
					<Button
						color="white"
						bg="brand.100"
						size="lg"
					>
						Logout
					</Button>
				</div>
			</div>
		</div>
	);
}
