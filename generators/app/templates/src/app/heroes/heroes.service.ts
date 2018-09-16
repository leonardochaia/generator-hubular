import { HeroInfo } from './heroes.models';
import { HubularRobot, Injectable } from 'hubular';

@Injectable()
export class HeroService {

    protected readonly heroes: HeroInfo[] = [
        { id: 'a7d2', name: 'Penny' }
    ];

    constructor(private robot: HubularRobot) {
        // TODO: Use robot.brain for persistence
    }

    public register(info: HeroInfo) {
        this.heroes.push(info);
    }

    public getAll() {
        return this.heroes;
    }
}
