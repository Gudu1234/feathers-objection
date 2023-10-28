// Initializes the `v1/admin-graphs` service on path `/v1/admin-graphs`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { AdminGraphs } from './admin-graphs.class';
import hooks from './admin-graphs.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'v1/admin-graphs': AdminGraphs & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v1/admin-graphs', new AdminGraphs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v1/admin-graphs');

  service.hooks(hooks);
}
