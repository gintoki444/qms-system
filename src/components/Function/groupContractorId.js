// ==============================|| Warehouse: (สำหรับข้อมูล โกดัง) ||============================== //
export const groupContractorId = (data) => {
  return data.reduce((acc, item) => {
    const contractorCompanyId = item.contract_company_id;

    if (!acc[contractorCompanyId]) {
      // acc.contract_company_id = contractorCompanyId;
      // acc.contractor_name = item.contractor_name;
      // acc.contract_company_name = item.contract_company_name;
      acc[contractorCompanyId] = {
        contract_company_id: contractorCompanyId,
        contractor_name: item.contractor_name,
        contract_company_name: item.contract_company_name,
        items: [item]
      };
    }
    //  else {
    //   acc[contractorCompanyId].push(item);
    // }

    return acc;
  }, {});
};
