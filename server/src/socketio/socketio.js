import { Server } from 'socket.io';

export function io(server) {
    io = new Server(server, {
        cors: {
          origin: "http://localhost:4000",
          methods: ["GET", "POST"]
        }
    });
}

export class Socketio {
    static async joinNamespace(name) {
        const space = await io.of(`/${name}`);
        space.on('connection', (socket) => {
            console.log(`connected in ${spaceName} with id: ${socket.id}`);
        })
        return space.name.slice(1);
    }
};










// to store metadata of namespaces
// export const spaces = [];

// export default async function socketio() {
//     await io.of(/^\/\w+$/).on('connection', async (socket) => {
//         const spaceMetadata = socket.nsp;
//         const space = spaceMetadata.name;
//         console.log("New Connection NameSpace", space, socket.id);

//         socket.on('confirmation', msg => {
//             spaceMetadata.emit('confirmation', msg);
//         });

//         if (spaces[space]) { return; }
//         else {
//             spaces[space] = spaceMetadata;
//         }

//         await spaceMetadata.on("connection", (socket) => {
//             console.log(`${space} > connection from ${socket.id}`);
//             // set the event handlers same as normal socket
//             socket.on('chatMessageForServer', (msg) => {
//                 console.log(msg);
//                 spaceMetadata.emit('chatMessageForClient', msg);
//             })

//             socket.on('disconnect', (reason) => {
//                 console.log(`${space}/${socket.id} > disconnected due to: ${reason}`);
//             });
//         })
//     })
//     return {
//         spaceMetadata,
//     };
// };