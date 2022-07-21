const producerRun = require('./kafka-producer')
const startConsumer = require('./kafka-consumer')

//testing kafka
let user = {
  firstName: 'gerald',
  lastName: 'parker',
  email: 'gerald@outlook.com',
  loginId: 'ger95',
  password: 'ger123',
  contactNumber: '07854652542'
}

producerRun(user).then(() => {
  startConsumer();
});
