// Initializes the `v1/statistics` service on path `/v1/statistics`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Statistics } from './statistics.class';
import createModel from '../../../models/statistics.model';
import hooks from './statistics.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'v1/statistics': Statistics & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v1/statistics', new Statistics(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/statistics');

  service.hooks(hooks);
}
