import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Inline styles for better portability
const styles = `
  .container {
    min-height: 100vh;
    background-color: rgb(24, 24, 27);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .imageContainer {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background-color: rgb(39, 39, 42);
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .imageLoaded {
    opacity: 1;
  }

  .loadingContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: rgb(212, 212, 216);
  }

  .spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .smallSpinner {
    width: 2rem;
    height: 2rem;
  }

  .error {
    background-color: rgba(153, 27, 27, 0.5);
    border: 1px solid rgb(239, 68, 68);
    color: rgb(254, 202, 202);
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    max-width: 24rem;
    text-align: center;
  }

  .label {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background-color: rgba(24, 24, 27, 0.8);
    color: rgb(161, 161, 170);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const IPFSFetchViewer = () => {
  const router = useRouter();
  const { cid } = router.query;
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchIPFSData = async () => {
      if (!cid) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch IPFS data');
        }
        
        const data = await response.text();
        const match = data.match(/ipfs:\/\/[^"]+/);
        
        if (match) {
          const ipfsPath = match[0].replace('ipfs://', '');
          setImageUrl(`https://ipfs.io/ipfs/${ipfsPath}`);
        } else {
          throw new Error('Invalid IPFS data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIPFSData();
  }, [cid]);

  if (!cid) return null;

  return (
    <div className="container">
      {loading && (
        <div className="loadingContainer">
          <div className="spinner" />
          <p>Loading IPFS content...</p>
        </div>
      )}
      
      {error && (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      )}
      
      {imageUrl && !loading && !error && (
        <div className="imageContainer">
          <div style={{ position: 'relative' }}>
            <img
              src={imageUrl}
              alt="IPFS content"
              className={`image ${imageLoaded ? 'imageLoaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {!imageLoaded && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div className="spinner smallSpinner" />
              </div>
            )}
          </div>
          <div className="label">IPFS Image</div>
        </div>
      )}
    </div>
  );
};

export default IPFSFetchViewer;