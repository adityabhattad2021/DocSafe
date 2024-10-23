import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';

export default function PDF() {
    const router = useRouter();
    const { cid, filename } = router.query;

    if (!cid) return null;

    return (
        <Flex align="center" justify="center" height="100vh" width="100vw" backgroundColor="#2B2C30">
            <img
                src={`https://ipfs.io/ipfs/${cid}`}
                alt={filename || 'IPFS content'}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
        </Flex>
    );
}