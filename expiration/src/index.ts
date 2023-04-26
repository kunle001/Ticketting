import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';


const start = async () => {
  if (!process.env.NATS_URL) throw new Error('provide nats url')
  if (!process.env.NATS_CLIENT_ID) throw new Error('provide nats client_id ')
  if (!process.env.NATS_CLUSTER_ID) throw new Error('provide nats cluster_id')
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();

  } catch (err) {
    console.log(err)
  };
};

start();


