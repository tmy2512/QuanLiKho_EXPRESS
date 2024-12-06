import { PROVINCE_API_ROOT } from "~/constants";

interface iProvinceProps {
    province_id: string;
    province_name: string;
    province_type: string;
}
interface iDistrictProps {
    district_id: string;
    province_id: string;
    district_name: string;
    district_type: string;
    lat: any;
    lng: any;
}
interface iWardProps {
    district_id: string;
    ward_id: string;
    ward_name: string;
    ward_type: string;
}

const getProvinces = async () => {
    try {
        const response = await fetch(`${PROVINCE_API_ROOT}/province`);

        const result = await response.json();
        const data: iProvinceProps[] = result.results;

        return data;
    } catch (error) {
        console.log(error);
    }
};

const getDistricts = async (provinceId: string) => {
    try {
        const response = await fetch(
            `${PROVINCE_API_ROOT}/province/district/${provinceId}`
        );

        const result = await response.json();
        const data: iDistrictProps[] = result.results;

        return data;
    } catch (error) {
        console.log(error);
    }
};

const getWards = async (districtId: string) => {
    try {
        const response = await fetch(
            `${PROVINCE_API_ROOT}/province/ward/${districtId}`
        );

        const result = await response.json();
        const data: iWardProps[] = result.results;

        return data;
    } catch (error) {
        console.log(error);
    }
};

export { getProvinces, getDistricts, getWards };
export type { iDistrictProps, iProvinceProps, iWardProps };
