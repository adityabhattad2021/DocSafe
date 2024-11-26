import { createAppKit } from '@reown/appkit/react'

import { http, WagmiProvider } from 'wagmi'
import { foundry, hardhat } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()


const projectId = '42fb454ce9eb2a4c382cdb9a2c515127'


const metadata = {
    name: 'DocSafe',
    description: 'AppKit Example',
    url: 'https://example.com',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [foundry]

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
    chains: [foundry],
    networks,
    projectId,
    ssr: true,
    transports: {
        [foundry.id]: http("http://localhost:8545")
    }
})

// 5. Create modal
createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
        analytics: true // Optional - defaults to your Cloud configuration
    }
})

export function AppKitProvider({ children }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}