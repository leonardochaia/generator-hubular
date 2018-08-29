import { Brain } from 'hubot';
import { HeroInfo } from './heroes.models';
import { Injectable, Inject } from 'injection-js';
import { BRAIN } from 'hubular';

@Injectable()
export class HeroService {

    protected readonly heroes: HeroInfo[] = [
        { id: 'a7d2', name: 'Penny' }
    ];

    constructor(
        @Inject(BRAIN)
        protected brain: Brain) {

        // TODO: Use the brain for persistence
    }

    public register(info: HeroInfo) {
        this.heroes.push(info);
    }

    public getAll() {
        return this.heroes;
    }
}
