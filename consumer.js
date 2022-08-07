const amqp = require('amqplib')

const queueName = process.argv[2]

const connect = async () => {
  try {
    console.log('Consumer Started...')
    const connection = await amqp.connect('amqp://localhost:5672')
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName)

    channel.consume(queueName, (message) => {
      const input = JSON.parse(message.content.toString())
      console.log('Recieved', {
        data: input.number,
        queue: queueName,
      })
      channel.ack(message)
    })
  } catch (error) {
    console.error(error)
  }
}

connect()
