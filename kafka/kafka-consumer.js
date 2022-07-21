const kafka = require('./kafka-client')

const startConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'simple-group' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'simple-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: `consumer reading ${message.value.toString()}`,
      });
    },
  });
};

module.exports = startConsumer