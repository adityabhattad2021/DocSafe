
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import { extendTheme } from "@chakra-ui/react";
import { StateContextProvider } from "../context";
import { AppKitProvider } from "../wagmi/config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()


const theme = extendTheme({
	colors: {
		brand: {
			100: "#4285F4",
		},
	},
});

function MyApp({ Component, pageProps }) {
	return (
		<AppKitProvider>
			<QueryClientProvider client={queryClient}>
				<ChakraProvider theme={theme}>
					<StateContextProvider>
						<Component {...pageProps} />
					</StateContextProvider>
				</ChakraProvider>
			</QueryClientProvider>
		</AppKitProvider>
	);
}

export default MyApp;
