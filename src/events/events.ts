import EventEmitter from 'events';

let eventEmitter = new EventEmitter().setMaxListeners(20);

export { eventEmitter };
