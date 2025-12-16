import { ref, onUnmounted } from "vue";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./useAuth";

export function useSignalR() {
  const hubConnection = ref(null);
  const isConnected = ref(false);

  const transactionReceived = ref(null);
  const transactionCompleted = ref(null);

  const { getToken } = useAuth();

  const startConnection = async () => {
    if (
      hubConnection.value &&
      hubConnection.value.state === signalR.HubConnectionState.Connected
    ) {
      console.log("Already Connected");
      return;
    }

    const token = getToken();
    if (!token) {
      console.error("Token not found");
      return;
    }

    hubConnection.value = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/hubs/transactions", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    setupListeners();

    try {
      await hubConnection.value.start();
      isConnected.value = true;
      console.log("✅ SignalR Connected");
    } catch (err) {
      console.error("❌ SignalR Error:", err);
      isConnected.value = false;
    }

    hubConnection.value.onclose(() => {
      isConnected.value = false;
      console.log("🔴 SignalR Disconnected");
    });

    hubConnection.value.onreconnected(() => {
      isConnected.value = true;
      console.log("🟢 SignalR Reconnected");
    });
  };

  const setupListeners = () => {
    if (!hubConnection.value) return;

    hubConnection.value.on("TransactionReceived", (data) => {
      console.log("📨 New Transaction:", data);
      transactionReceived.value = data;
    });

    hubConnection.value.on("TransactionCompleted", (data) => {
      console.log("✅ Transaction Completed:", data);
      transactionCompleted.value = data;
    });
  };

  const stopConnection = async () => {
    if (hubConnection.value) {
      await hubConnection.value.stop();
      isConnected.value = false;
    }
  };

  const joinGroup = async (name) => {
    if (hubConnection.value) {
      await hubConnection.value.invoke("JoinGroup", name);
      console.log("Joined Group:", name);
    }
  };

  const leaveGroup = async (name) => {
    if (hubConnection.value) {
      await hubConnection.value.invoke("LeaveGroup", name);
      console.log("Left Group:", name);
    }
  };

  onUnmounted(() => {
    stopConnection();
  });

  return {
    isConnected,
    transactionReceived,
    transactionCompleted,
    startConnection,
    stopConnection,
    joinGroup,
    leaveGroup,
  };
}
