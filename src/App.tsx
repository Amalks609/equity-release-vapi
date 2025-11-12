
import { useEffect, useRef, useState } from "react";
import VapiClient from "@vapi-ai/web";
import "./App.css";

function App() {

  return (
    <VoiceAgent />
  )
}

export default App




function VoiceAgent() {
  const vapiRef = useRef<VapiClient | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startConversation = async () => {
    const vapi = vapiRef.current;
    if (!vapi || isLoading) {
      return;
    }

    const workflowId = import.meta.env.VITE_VAPI_WORKFLOW_ID;
    if (!workflowId) {
      setError("Missing VITE_VAPI_WORKFLOW_ID environment variable.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await vapi.start(undefined, undefined, undefined, workflowId);
      setIsActive(true);
    } catch (err) {
      console.error("Failed to start workflow:", err);
      setError("Failed to start conversation.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopConversation = async () => {
    const vapi = vapiRef.current;
    if (!vapi || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await vapi.stop();
      setIsActive(false);
    } catch (err) {
      console.error("Failed to stop workflow:", err);
      setError("Failed to stop conversation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleConversation = () => {
    if (isActive) {
      stopConversation();
    } else {
      startConversation();
    }
  };

  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      console.error("Missing VITE_VAPI_PUBLIC_KEY environment variable.");
      return;
    }

    // Initialize only once
    if (!vapiRef.current) {
      vapiRef.current = new VapiClient(publicKey);
    }

    const vapi = vapiRef.current;
    if (!vapi) {
      console.error("Unable to initialize Vapi client.");
      return;
    }
    console.log(vapi);

    // Optional: handle messages or events
    const handleMessage = (message: unknown) => {
      console.log("Agent message:", message);
    };
    vapi.on("message", handleMessage);

    // Cleanup on unmount
    return () => {
      vapi.removeListener("message", handleMessage);
      vapi.stop();
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold mb-4"></h2>
      <button
        onClick={handleToggleConversation}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 border-2 border-blue-600"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : isActive ? "Stop Conversation" : "Start Conversation"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
