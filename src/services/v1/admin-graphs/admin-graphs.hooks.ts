import AdminGraphData from './hooks/AdminGraphData';
import CustomAuth from '../../../authentication/CustomAuth';
import Permit from '../../../hooks/Permit';
import { disallow } from 'feathers-hooks-common';

export default {
    before: {
        all: [CustomAuth()],
        find: [Permit.or(Permit.ADMIN), AdminGraphData()],
        get: [disallow()],
        create: [disallow()],
        update: [disallow()],
        patch: [disallow()],
        remove: [disallow()],
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
};
