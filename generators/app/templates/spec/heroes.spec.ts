// tslint:disable:max-classes-per-file

import { RobotMock } from './robot-mock';
import { bootstrapModule, Injector } from 'hubular';
import { AppModule } from '../src/app/app.module';
import { HeroService } from '../src/app/heroes/heroes.service';

let robotMock: RobotMock;

beforeEach(() => {
    // RobotMock receives a robot and logLevel
    // as parameters for further customization.
    robotMock = new RobotMock();
});

afterEach(() => {
    robotMock.dispose();
});

export default describe('Heroes Modules', () => {

    // Testing hubot layer
    it('hubot should respond to hubot heroes', () => {

        bootstrapModule(AppModule)(robotMock.robot);

        return robotMock
            .sendMessage('hubot heroes')
            .onSend((envelop, msgs) => {
                const answer = msgs[0];

                expect(answer).toContain('heroes registered');
            });
    });

    // Testing service layer
    it('service should list heroes', () => {

        bootstrapModule(AppModule)(robotMock.robot);
        const injector: Injector = robotMock.robot.injector;

        const heroService = injector.get(HeroService);

        expect(heroService).toBeDefined();

        const heroes = heroService.getAll();

        expect(heroes).toBeDefined();
        expect(heroes.length).toBeGreaterThan(0);
    });
});
