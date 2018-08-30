import { HeroService } from './heroes.service';
import { HubularModule, HubularRobot, RobotRespond } from 'hubular';
import { Response } from 'hubot';

@HubularModule({
    providers: [
        HeroService
    ]
})
export class HeroesModule {

    constructor(private hero: HeroService) { }

    @RobotRespond(/heroes$/)
    protected listHeroes(res: Response<HubularRobot>) {
        const heroes = this.hero.getAll();
        const formatted = heroes.map((e, i) => `${i + 1}. ${e.name}`).join('\n');

        res.send(`${heroes.length} heroes registered:`, formatted, `😻`);
    }

    @RobotRespond(/add hero (.*)/)
    protected addHero(res: Response<HubularRobot>) {
        const name = res.match[1];
        this.hero.register({
            id: name,
            name,
        });
        res.send(`👏👏👏 Hurray!`, `${name} has been proclaimed a Hero!.`, '👏👏👏');
    }
}
