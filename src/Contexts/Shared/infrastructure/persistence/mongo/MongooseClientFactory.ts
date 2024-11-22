import mongoose, { Mongoose } from 'mongoose';
import MongoConfig from './MongoConfig';

export class MongooseClientFactory {
  private static clients: { [key: string]: Mongoose } = {};

  static async createClient(contextName: string, config: MongoConfig): Promise<Mongoose> {
    let client = MongooseClientFactory.getClient(contextName);

    if (!client) {
      client = await MongooseClientFactory.createAndConnectClient(config);

      MongooseClientFactory.registerClient(client, contextName);
    }

    return client;
  }

  private static getClient(contextName: string): Mongoose | null {
    return MongooseClientFactory.clients[contextName] || null;
  }

  private static async createAndConnectClient(config: MongoConfig): Promise<Mongoose> {
    return mongoose.connect(config.url, config.options || {});
  }

  private static registerClient(client: Mongoose, contextName: string): void {
    MongooseClientFactory.clients[contextName] = client;
  }

  static async closeClient(contextName: string): Promise<void> {
    const client = MongooseClientFactory.clients[contextName];
    if (client) {
      await client.disconnect();
      delete MongooseClientFactory.clients[contextName];
    }
  }

  static async closeAllClients(): Promise<void> {
    for (const contextName in MongooseClientFactory.clients) {
      await MongooseClientFactory.closeClient(contextName);
    }
  }
}
