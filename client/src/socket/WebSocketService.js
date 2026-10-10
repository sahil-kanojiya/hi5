import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = Stomp.over(() => new SockJS('http://localhost:8080/hi5/ws'));
    this.client.reconnect_delay = 5000;
    this.heartbeatInterval = null;
    this.userId = null;
  }

  connect(userId, callback) {
    this.userId = userId;
    this.client.connect(
      { userId },
      () => {
        callback();
        this.startHeartbeat();
      },
      (error) => {
        console.error('WebSocket connection error:', error);
      }
    );
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.client.connected) {
      this.client.deactivate();
    }
  }

  subscribeTopic(topic, callback) {
    if (this.client.connected) {
      const subscription = this.client.subscribe(topic, (message) => {
        callback(message.body);
      });
      return subscription;
    }
  }

  unsubscribeTopic(subscription) {
    subscription.unsubscribe();
  }

  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = setInterval(() => {
      if (this.client.connected && this.userId) {
        this.client.send('/app/heartbeat', {}, JSON.stringify({ userId: this.userId }));
      }
    }, 10000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  publish(path, body) {
    if (this.client.connected) {
      this.client.send(path, {}, JSON.stringify(body));
    } else {
      console.error('Cannot send message: Client is not connected.');
    }
  }
}

export default new WebSocketService();
