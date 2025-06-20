import { container } from 'tsyringe';

import { TimeService } from '../../services/time/time.service';

container.register('TimeService', {
  useClass: TimeService,
});

export { container as time };
