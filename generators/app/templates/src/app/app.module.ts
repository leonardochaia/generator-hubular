// Description:
//   Root Hubot Module. All your modules must be imported.
//
// Author:
//   Leonardo Chaia (lchaia@astonishinglab.com)

import { HubularModule } from 'hubular';
import { EmployeeModule } from './employee/employee.module';

@HubularModule({
    imports: [
        EmployeeModule,
    ],
})
export class AppModule { }
