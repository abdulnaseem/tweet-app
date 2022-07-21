const kafka = require('./kafka-client')

const producerRun = async (message) => {
    // kafka producer
    const producer = kafka.producer();
    await producer.connect();
  
    await producer.send({
      topic: 'simple-topic',
      messages: [
        {
          value: JSON.stringify(message)
        },
      ],
    });
  
    await producer.send({
      topic: 'simple-topic',
      messages: [
        {
          value: 'second message',
        },
      ],
    });
  
    await producer.disconnect();
  };

  module.exports = producerRun