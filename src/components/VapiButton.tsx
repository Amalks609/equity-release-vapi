import React from 'react';
import { useVapi } from '../hooks/useVapi';

interface VapiButtonProps {
  publicKey?: string;
  assistantId?: string;
  baseUrl?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const VapiButton: React.FC<VapiButtonProps> = ({
  publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY,
  assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID,
  //baseUrl = process.env.REACT_APP_VAPI_BASE_URL,
  style,
  children,
}) => {
  const { startCall, endCall, isSessionActive, isLoading, error } = useVapi({
    publicKey: publicKey || '',
    assistantId: assistantId || '',
  //  baseUrl,
  });

  const handleClick = () => {
    if (isSessionActive) {
      endCall();
    } else {
      startCall();
    }
  };

  if (!publicKey || !assistantId) {
    return (
      <div style={{ color: 'red', padding: '8px' }}>
        Missing Vapi configuration. Please set environment variables.
      </div>
    );
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#3B82F6',
    color: 'white',
    fontWeight: 'bold',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.5 : 1,
    ...style
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        style={buttonStyle}
      >
        {children || (isLoading ? 'Connecting...' : isSessionActive ? 'End Call' : 'Start Call')}
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
          Error: {error}
        </div>
      )}
    </>
  );
};
