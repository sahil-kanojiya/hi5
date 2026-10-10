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
    console.log('connecting to websocket with user id: ', userId);
    this.userId = userId;
    this.client.connect(
      { userId },
      (frame) => {
        console.log('Connected: ' + frame);
        callback();
        this.startHeartbeat();
      },
      (error) => {
        console.error('WebSocket connection error:', error);
      }
    );
  }

  disconnect() {
    console.log('Deactivating WebSocket...');
    this.stopHeartbeat();
    if (this.client.connected) {
      this.client.deactivate();
    }
  }

  subscribeTopic(topic, callback) {
    if (this.client.connected) {
      console.log('Subscribing to topic:', topic);
      const subscription = this.client.subscribe(topic, (message) => {
        callback(message.body);
      });
      return subscription;
    } else {
      console.log('WebSocket not connected');
    }
  }

  unsubscribeTopic(subscription) {
    subscription.unsubscribe();
    console.log('Unsubscribed');
  }

  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    console.log('Starting heartbeat...');
    this.heartbeatInterval = setInterval(() => {
      if (this.client.connected && this.userId) {
        this.client.send('/app/heartbeat', {}, JSON.stringify({ userId: this.userId }));
        console.log(`Heartbeat sent for user ${this.userId}`);
      }
    }, 10000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log('Heartbeat stopped.');
    }
  }

  publish(path, body) {
    if (this.client.connected) {
      this.client.send(path, {}, JSON.stringify(body));
      console.log(`Message sent to ${path}`);
    } else {
      console.error('Cannot send message: Client is not connected.');
    }
  }
}

export default new WebSocketService();
