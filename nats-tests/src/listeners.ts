import { TicketCreatedListener } from './events/ticketCreated_listener';
import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto';


console.clear()

const stan = nats.connect('ticketting', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to nats')

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit()
  })

  new TicketCreatedListener(stan).listen();
})
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

