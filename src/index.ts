import Transport from 'winston-transport'
import mqtt, { MqttClient } from 'mqtt'

class MQTT extends Transport {
    host: string
    port: number
    clientId: string
    username: string
    password: string
    protocolVersion: number
    client: MqttClient
    topic: string
    connected: boolean = false
    includeMeta: boolean
    delay: number | null
    constructor(opts: any) {
        super(opts)
        this.host = opts.host || 'localhost'
        this.port = opts.port || 1883
        this.clientId = opts.clientId || ''
        this.username = opts.username || ''
        this.password = opts.password || ''
        this.protocolVersion = opts.protocolVersion || 5
        this.topic = opts.topic || opts.level
        this.includeMeta = opts.includeMeta || false
        this.delay = opts.delay || null

        this.client = mqtt.connect(this.host, {
            port: this.port,
            clientId: this.clientId,
            username: this.username,
            password: this.password,
            protocolVersion: this.protocolVersion,
        })

        this.client.on('connect', () => {
            this.connected = true
        })

        this.client.on('offline', () => {
            this.connected = false
        })

        this.client.on('disconnect', () => {
            this.connected = false
        })

        this.client.on('error', (error: Error) => {
            console.log(error.message)
        })
    }

    log(logMessage: any, callback: CallableFunction) {

        if (this.delay) {
            (async () => {
                new Promise(resolve => setTimeout(resolve, this.delay))
            })()
        }

        const { level, message, ...meta } = logMessage

        if (this.includeMeta === true) {
            this.client.publish(this.topic, JSON.stringify(logMessage), {
                properties: { contentType: 'application/json' }
            })
        }
        else {
            this.client.publish(this.topic, message)
        }
        
        callback()
    }
}

export default MQTT