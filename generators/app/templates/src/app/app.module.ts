// Description:
//   Root Hubot Module. All your modules must be imported.
//
// Author:
//   Leonardo Chaia (lchaia@astonishinglab.com)

import { HubularModule } from 'hubular';
import { HeroesModule } from './heroes/heroes.module';

@HubularModule({
    imports: [
        HeroesModule,
    ],
})
export class AppModule { }
