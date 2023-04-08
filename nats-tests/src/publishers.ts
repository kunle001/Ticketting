import nats from 'node-nats-streaming';

console.clear()

const stan = nats.connect('ticketting', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('publisher connected to nats')

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
  });

  stan.publish('ticket:created', data, () => {
    console.log('doc published')
  })
});