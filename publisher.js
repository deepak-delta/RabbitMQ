const amqp = require('amqplib')

const inputParams = process.argv[2]

const connect = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672')
    const channel = await connection.createChannel()
    await channel.assertQueue('odd.number')
    await channel.assertQueue('even.number')
    const queueName = parseInt(inputParams) % 2 ? 'odd.number' : 'even.number'
    console.log(`Publishing`, {
      data: inputParams,
      queue: queueName,
    })
    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ number: inputParams }))
    )

    await channel.close()
    await connection.close()
  } catch (error) {
    console.error(error)
  }
}

connect()
