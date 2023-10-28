// Initializes the `v1/user` service on path `/v-1-user`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { User } from './user.class';
import createModel from '../../../models/user.model';
import hooks from './user.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'v-1-user': User & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/v-1-user', new User(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('v-1-user');

  service.hooks(hooks);
}
