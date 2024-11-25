import { RabbitMQConfig } from '../../../Contexts/Mooc/Shared/infrastructure/RabbitMQ/RabbitMQConfigFactory';
import { DomainEventSubscribers } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { RabbitMQConfigurer } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfigurer';
import { RabbitMqConnection } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMqConnection';
import container from '../dependency-injection';

export class ConfigureRabbitMQCommand {
  static async run() {
    const connection = container.get<RabbitMqConnection>('Mechoui3.Shared.RabbitMQConnection');
    const { name: exchange } = container.get<RabbitMQConfig>('Mechoui3.Shared.RabbitMQConfig').exchangeSettings;
    await connection.connect();

    const configurer = container.get<RabbitMQConfigurer>('Mechoui3.Shared.RabbitMQConfigurer');
    const subscribers = DomainEventSubscribers.from(container).items;

    await configurer.configure({ exchange, subscribers });
    await connection.close();
  }
}