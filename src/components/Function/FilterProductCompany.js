export const filterProductCom = async (companys) => {
    return new Promise((resolve) => {
        // แยกรายการบริษัทที่ไม่ใช่ 6 และ 9
        const others = companys.filter(company => company.product_company_id !== 6 && company.product_company_id !== 9);
        // หาและเก็บรายการบริษัทที่มี product_company_id เป็น 6 และ 9
        const company6 = companys.find(company => company.product_company_id === 6);
        const company9 = companys.find(company => company.product_company_id === 9);

        // รวมรายการตามลำดับที่ต้องการ
        const sortedCompanies = [
            ...others.slice(0, others.findIndex(company => company.product_company_id > 6)), // ก่อน product_company_id 6
            company6,
            company9,
            ...others.slice(others.findIndex(company => company.product_company_id > 6)) // หลัง product_company_id 6
        ];
        resolve(sortedCompanies);
    });
};