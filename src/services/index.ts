import { Application } from '../declarations';
import v1User from './v1/user/user.service';
import v1Statistics from './v1/statistics/statistics.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(v1User);
  app.configure(v1Statistics);
}
