import nats, { Stan } from 'node-nats-streaming'

class NatsWraper {
  private _client?: Stan;

  get client() {
    if (!this._client) throw new Error('cannot access NATS before connecting')

    return this._client
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });


    return new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('connected to NAS')
        resolve();
      });
      this._client!.on('error', (err) => {
        console.log(err)
        reject(err)
      })
    })
  }
};

export const natsWrapper = new NatsWraper()