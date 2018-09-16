// Description:
//   Root Hubot Module. All your modules must be imported.
//
// Author:
//   Leonardo Chaia (lchaia@astonishinglab.com)

import { HubularModule, RobotCatchAll, HubularRobot } from 'hubular';
import { HeroesModule } from './heroes/heroes.module';
import { Response } from 'hubot';

@HubularModule({
    imports: [
        HeroesModule,
    ],
})
export class AppModule {

    @RobotCatchAll()
    protected onCatchAll(res: Response<HubularRobot>) {
        res.send('Sorry, can\'t help you with that.');
    }
}
