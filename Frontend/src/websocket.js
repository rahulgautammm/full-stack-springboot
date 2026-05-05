import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (onIncidentReceived, onTaskReceived) => {
    stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        debug: () => {}, // Disable debug logs
        onConnect: () => {
            console.log('Connected to WebSocket');
            
            if (onIncidentReceived) {
                stompClient.subscribe('/topic/incidents', (message) => {
                    onIncidentReceived(JSON.parse(message.body));
                });
            }
            
            if (onTaskReceived) {
                stompClient.subscribe('/topic/tasks', (message) => {
                    onTaskReceived(JSON.parse(message.body));
                });
            }
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        }
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    if (stompClient !== null) {
        stompClient.deactivate();
    }
    console.log("Disconnected");
};
