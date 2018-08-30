// tslint:disable:max-classes-per-file
import { Robot, TextMessage } from 'hubot';
import { resolve as resolvePath } from 'app-root-path';

export type adapterEventCallback = (envelope: any, msgs: string[]) => void;

export class RobotMock {

    public readonly robot: any;
    public readonly testUser: any;

    constructor(robot?: Robot<any>, logLevel = 'info') {

        process.env.HUBOT_LOG_LEVEL = process.env.HUBOT_LOG_LEVEL || logLevel;

        this.robot = robot || new Robot(null as any, 'mock-adapter-v3', false, 'hubot');

        const scripts = resolvePath('/spec/dist/src');
        this.robot.load(scripts);
        this.robot.adapter.on('connected', () => {
            this.robot.brain.userForId('1', {
                name: 'john',
                real_name: 'John Doe',
                room: '#test'
            });
        });
        this.robot.run();
        this.testUser = this.robot.brain.userForName('john');
    }

    public sendMessage(msg: string) {
        this.robot.adapter.receive(new TextMessage(this.testUser, msg));
        return new RobotMessageAwaiter(this);
    }

    public dispose() {
        this.robot.shutdown();
    }
}

class RobotMessageAwaiter {

    constructor(private readonly robotMock: RobotMock) { }

    public onSend(fn: adapterEventCallback) {
        return this.bindToAdapter('send', fn);

    }

    public onReply(fn: adapterEventCallback) {
        return this.bindToAdapter('reply', fn);
    }

    protected bindToAdapter(event: string, fn: adapterEventCallback) {
        return new Promise((resolve) => {
            this.robotMock.robot.adapter.on(event, (envelope: any, strings: any) => {
                fn(envelope, strings);
                resolve();
            });
        });
    }
}
