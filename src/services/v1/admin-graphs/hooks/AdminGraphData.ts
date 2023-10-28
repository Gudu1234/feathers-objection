import { HookContext } from '@feathersjs/feathers';
import { adminGraphInterface, adminGraphQuery } from '../interface/adminGraphInterface';

const AdminGraphData = () => async (context: HookContext) => {
    const {
        app,
        params: { query },
    } = context;

    const { startDate, endDate } = query as adminGraphQuery;

    const Knex = app.get('knex');
    let inHandPerCarQuery: string;
    let businessPerCarQuery: string;
    let uberCashQuery: string;
    let olaCashQuery: string;

    const vehicleService = await app.service('v1/vehicle');

    const allVehicle = await vehicleService._find({
        query: {
            status: 1,
        },
        paginate: false,
    });

    // console.log(allVehicle);

    if (startDate && endDate) {
        inHandPerCarQuery = `SELECT SUM(CASE
                                            WHEN transaction.type = 1 THEN transaction.price
                                            ELSE -1 * transaction.price END) AS totalEarning,
                                    vehicleId,
                                    vehicle.licenseNumber
                             FROM transaction
                                      INNER JOIN vehicle on transaction.vehicleId = vehicle.id
                             WHERE (transaction.parentType = 1 OR transaction.parentType = 2 OR
                                    transaction.parentType = 4)
                               AND (transaction.createdAt <= '${endDate}' and transaction.createdAt >= '${startDate}')
                             GROUP BY vehicleId`;

        businessPerCarQuery = `SELECT SUM(transaction.price) AS totalEarning, vehicleId, vehicle.licenseNumber
                               FROM transaction
                                        INNER JOIN vehicle on transaction.vehicleId = vehicle.id
                               WHERE (transaction.parentType = 1 OR transaction.parentType = 2 OR
                                      transaction.parentType = 4)
                                 AND (transaction.createdAt <= '${endDate}' and transaction.createdAt >= '${startDate}')
                               GROUP BY vehicleId`;

        uberCashQuery = `SELECT ride.vehicleId,
                                SUM(ride.price + ride.extraCharges) as totalEarning,
                                vehicle.licenseNumber
                         FROM ride
                                  INNER JOIN vehicle ON ride.vehicleId = vehicle.id
                         WHERE ride.status = 4
                           AND ride.receivedBy = 2
                           AND ride.type = 3
                           AND ride.tripDate <= '${endDate}'
                           and ride.tripDate >= '${startDate}'
                         GROUP BY ride.vehicleId`;

        olaCashQuery = `SELECT ride.vehicleId,
                               SUM(ride.price + ride.extraCharges) as totalEarning,
                               vehicle.licenseNumber
                        FROM ride
                                 INNER JOIN vehicle ON ride.vehicleId = vehicle.id
                        WHERE ride.status = 4
                          AND ride.receivedBy = 2
                          AND ride.type = 2
                          AND ride.tripDate <= '${endDate}'
                          and ride.tripDate >= '${startDate}'
                        GROUP BY ride.vehicleId`;
    } else {
        inHandPerCarQuery = `SELECT SUM(CASE
                                            WHEN transaction.type = 1 THEN transaction.price
                                            ELSE -1 * transaction.price END) AS totalEarning,
                                    vehicleId,
                                    vehicle.licenseNumber
                             FROM transaction
                                      INNER JOIN vehicle on transaction.vehicleId = vehicle.id
                             WHERE transaction.parentType = 1
                                OR transaction.parentType = 2
                                OR transaction.parentType = 4
                             GROUP BY vehicleId`;

        businessPerCarQuery = `SELECT SUM(transaction.price) AS totalEarning, vehicleId, vehicle.licenseNumber
                               FROM transaction
                                        INNER JOIN vehicle on transaction.vehicleId = vehicle.id
                               WHERE transaction.parentType = 1
                                  OR transaction.parentType = 2
                                  OR transaction.parentType = 4
                               GROUP BY vehicleId`;

        uberCashQuery = `SELECT ride.vehicleId,
                                SUM(ride.price + ride.extraCharges) as totalEarning,
                                vehicle.licenseNumber
                         FROM ride
                                  INNER JOIN vehicle ON ride.vehicleId = vehicle.id
                         WHERE ride.status = 4
                           AND ride.receivedBy = 2
                           AND ride.type = 3
                         GROUP BY ride.vehicleId`;

        olaCashQuery = `SELECT ride.vehicleId,
                               SUM(ride.price + ride.extraCharges) as totalEarning,
                               vehicle.licenseNumber
                        FROM ride
                                 INNER JOIN vehicle ON ride.vehicleId = vehicle.id
                        WHERE ride.status = 4
                          AND ride.receivedBy = 2
                          AND ride.type = 2
                        GROUP BY ride.vehicleId`;
    }

    const inHandPerCar: Array<adminGraphInterface> = await Knex.raw(inHandPerCarQuery).then((res: any) => res[0]);
    const businessPerCar: Array<adminGraphInterface> = await Knex.raw(businessPerCarQuery).then((res: any) => res[0]);
    const uberCash: Array<adminGraphInterface> = await Knex.raw(uberCashQuery).then((res: any) => res[0]);
    const olaCash: Array<adminGraphInterface> = await Knex.raw(olaCashQuery).then((res: any) => res[0]);

    const inHandPerCarArray: any = [];

    const businessPerCarArray: any = [];

    const uberCashArray: any = [];

    const olaCashArray: any = [];

    allVehicle.forEach((each: any) => {
        const inHandValIndex = inHandPerCar.findIndex((each1: any) => each1.vehicleId === each.id);
        const businessPerCarValIndex = businessPerCar.findIndex((each1: any) => each1.vehicleId === each.id);
        const uberCashIndex = uberCash.findIndex((each1: any) => each1.vehicleId === each.id);
        const olaCashIndex = olaCash.findIndex((each1: any) => each1.vehicleId === each.id);

        if (inHandValIndex >= 0) {
            inHandPerCarArray.push(inHandPerCar[inHandValIndex]);
        } else {
            inHandPerCarArray.push({ totalEarning: 0, vehicleId: each.id, licenseNumber: each.licenseNumber });
        }

        if (businessPerCarValIndex >= 0) {
            businessPerCarArray.push(businessPerCar[businessPerCarValIndex]);
        } else {
            businessPerCarArray.push({ totalEarning: 0, vehicleId: each.id, licenseNumber: each.licenseNumber });
        }

        if (uberCashIndex >= 0) {
            uberCashArray.push(uberCash[uberCashIndex]);
        } else {
            uberCashArray.push({ totalEarning: 0, vehicleId: each.id, licenseNumber: each.licenseNumber });
        }

        if (olaCashIndex >= 0) {
            olaCashArray.push(olaCash[olaCashIndex]);
        } else {
            olaCashArray.push({ totalEarning: 0, vehicleId: each.id, licenseNumber: each.licenseNumber });
        }
    });

    context.result = {
        inHandPerCar: inHandPerCarArray,
        businessPerCar: businessPerCarArray,
        uberCash: uberCashArray,
        olaCash: olaCashArray,
    };
};

export default AdminGraphData;
