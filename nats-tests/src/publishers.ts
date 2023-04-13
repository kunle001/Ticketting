import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';


console.clear()

const stan = nats.connect('ticketting', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('publisher connected to nats')
  const publisher = new TicketCreatedPublisher(stan);

  await publisher.publish({
    id: 'rewytsn',
    title: 'test event',
    price: 20
  })

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('doc published')
  // })
});