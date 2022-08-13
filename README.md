
## Usage

```typescript
import winston from 'winston'
import MQTT from '@seanvelasco/winston-mqtt'

const mqttOptions = {
    host: '127.0.0.1',
    port: 1883,
    clientId: '',
    username: '',
    password: '',
}

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({ filename: 'info.log', level: 'info' }),
        new MQTT({ ...mqttOptions, topic: 'diagnostics/info', level: 'info' }),
    ]
})
```

## Limitations

- Creates new MQTT client for each transport
- Does not support multiple topics for the same transport
- No TLS support

## In the future

- TLS support
- Add option for delayed publishing