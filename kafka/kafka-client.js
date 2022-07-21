const { Kafka } = require('kafkajs');

// kafka client
const kafka = new Kafka({
  clientId: 'simple-producer-consumer-application',
  brokers: ['localhost:9092'],
});

module.exports = kafka