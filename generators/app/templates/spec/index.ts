import 'reflect-metadata';

declare module 'hubot' {
    class TextMessage {
        constructor(user: any, msg: string);
    }
}

import './heroes.spec';
