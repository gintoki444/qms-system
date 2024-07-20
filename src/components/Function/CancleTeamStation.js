import * as reserveRequest from '_api/reserveRequest';
import * as adminRequest from '_api/adminRequest';
import * as stepRequest from '_api/StepRequest';

async function getReserveData(id) {
    return await new Promise((resolve) => {
        reserveRequest.getReserDetailID(id).then((response) => {
            if (response) {
                resolve(response.reserve);
            }
        });
    });
}

// =============== บันทึกข้อมูล ===============//
const updateContractor = async (id, status) => {
    const currentDate = await stepRequest.getCurrentDate();

    try {
        const data = {
            contract_status: status,
            contract_update: currentDate
        };

        stepRequest.putContractorStatus(id, data);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
};
const updateTeamLoading = (reserveId, values) => {
    try {
        adminRequest.putReserveTeam(reserveId, values);
    } catch (error) {
        console.log(error);
    }
};
const updateTeamData = (reserveId, values) => {
    try {
        adminRequest.putReserveTeamData(reserveId, values);
    } catch (error) {
        console.log(error);
    }
};

export const updateCancleTeamStation = async (reserveId) => {
    // const [reserData, setReserveData] = useState([]);
    const reserveData = await getReserveData(reserveId);
    const contractor_id = reserveData[0].contractor_id;
    await updateContractor(contractor_id, 'waiting');

    reserveData[0].warehouse_id = 1;
    reserveData[0].reserve_station_id = 1;
    reserveData[0].team_id = null;
    reserveData[0].contractor_id = null;
    reserveData[0].labor_line_id = null;
    reserveData[0].team_data = null;
    reserveData[0].description = reserveData[0].reserve_description;
    const teamValue = {
        team_id: null,
        contractor_id: null,
        labor_line_id: null
    };

    await reserveRequest.putReserById(reserveId, reserveData[0]).then((result) => {
        if (result.status === 'ok') {
            updateTeamLoading(reserveId, teamValue);
            updateTeamData(reserveId, []);
        } else {
            alert(result['message']['sqlMessage']);
        }
    }).catch((error) => {
        console.log(error);
    });
    return reserveData[0];
};