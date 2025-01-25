
export const roleBasePolicy = (role) => {
    if (role != 'User') {
        return true;
    } else {
        return false;
    }
}