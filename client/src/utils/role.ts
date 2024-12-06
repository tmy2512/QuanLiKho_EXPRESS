import ROLES from "~/constants/roles";

function roleIdGenerator(idPermissions: number[]) {
    let roleId: number = 0;
    ROLES.forEach((role) => {
        if (
            JSON.stringify(role.idPermissions) === JSON.stringify(idPermissions)
        ) {
            roleId = role.id;
        }
    });
    return roleId;
}

export default roleIdGenerator;
