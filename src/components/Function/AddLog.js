
import * as adminRequest from '_api/adminRequest';
import * as stepRequest from '_api/StepRequest';
// ==============================|| เพิ่มข้อมูล Logs ||============================== //
export const AddAuditLog = async (data) => {

    const currentDate = await stepRequest.getCurrentDate();
    data.audit_datetime = currentDate;
    try {
        console.log('AddAuditLog data ', data)
        // if (data === 999) {
        await adminRequest.AddAuditLogs(data);
        // }
    } catch (error) {
        console.log(error);
    }
};