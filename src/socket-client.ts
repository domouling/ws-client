import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectServer = (token: string) => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js',{
        extraHeaders: {
            hola: 'mundo',
            authentication: token,
        }
    });
    
    socket?.removeAllListeners(); //Borrar todos los listeners que tenga el socket
    socket = manager.socket('/');
    
    addListeners();
    
}

const addListeners = () => {
    const serverStatusLabel = document.querySelector<HTMLSpanElement>('#server-status')!;
    const clientsUl = document.querySelector<HTMLUListElement>('#clients-ul')!;

    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;

    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

    //TODO: #clients-ul

    socket.on('connect', () => {
        serverStatusLabel.innerText = 'connected';
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerText = 'disconnected';
    });

    socket.on('clients-updates', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml += `<li>${ clientId }</li>`;
        });
        clientsUl.innerHTML = clientsHtml;
    });
    
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (messageInput.value.trim().length <= 0) return;
        
        socket.emit('message-from-client', { id: 'YO!!', message: messageInput.value });
        messageInput.value = '';
    });

    socket.on('message-from-server', (payload: { fullName: string, message: string }) => {
        const newMessage = `
            <li>
                <strong>${ payload.fullName }</strong>
                <span>${ payload.message }</span>
            </li>
        `;

        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl.appendChild(li);
    })
}

