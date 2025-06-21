import { container } from 'tsyringe';

import { ValidateStringRegexService } from '../../services/validateStringRegex/validateStringRegex.service';

container.register('ValidateStringRegexService', {
  useClass: ValidateStringRegexService,
});

export { container as validateStringRegex };
