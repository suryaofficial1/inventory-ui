/**
 * 
 * @param {*} mobile_no 
 * @returns : {error: boolean, message:String, mobile: String}
 *      error : true if error
 *      message : message to show if error true
 *      mobile : updated mobile number if error false
 */
export function validateContactNumber(mobile_no) {

    if (mobile_no.trim() === "") {
        return { 'error': true, message: 'Please enter your mobile number' };
    }

    const mobile_number_patter = /^([0-9]|\+)[0-9]+$/g;
    if (!mobile_number_patter.test(mobile_no)) {
        return { 'error': true, message: 'Please enter your mobile number' };
    }

    if (!(mobile_no.length > 8 && mobile_no.length < 12)) {
        return { 'error': true, message: 'Please enter a valid mobile number' };
    }

    return { 'error': false, mobile: mobile_no };
}

/**
 * 
 * @param {*} email
 * @returns : {error: boolean, message:String, mobile: String}
 *      error : true if error
 *      message : message to show if error true
 *      email : updated email if error false
 */
export function validateEmail(email) {

    if (email.trim() == '') {
        return { 'error': true, message: 'Email id required' };
    }
    if (email.trim().length > 52) {
        return { 'error': true, message: 'Too many characters - enter a valid email id' };
    }
    const emailPattern = email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/) || !/\S+$/.test(email)
    if (!emailPattern) {
        return { 'error': true, message: 'Email id not valid' };
    }
    return { 'error': false, email: email.trim() };
}

export function validateNumber(name, value) {
    if (typeof value !== 'string') {
        return { error: true, message: `${name} must be a string` };
    }

    if (value.trim() === "") {
        return { error: false, value: "" }; 
    }

    if (!/^[0-9]+$/.test(value.trim())) {
        return { error: true, message: `${name} accepts only numbers` };
    }

    return { error: false, value: value.trim() };
}



const LETTERS_REGEX = /^[a-zA-Z]+(\s{0,1}[a-zA-Z])*$/;
/**
 * 
 * @param {string} email
 * @param {string} element
 * @returns : {error: boolean, message:String}
 *      error : true if error
 *      message : message to show if error true
 */
export function validateName(name, element) {
    if (name.trim() == "" || name == null) {
        return { error: true, message: 'Please enter your ' + element }
    }
    if (!name.trim().match(LETTERS_REGEX)) {
        return { error: true, message: 'Invalid characters in ' + element }
    }
    if (name.trim().length > 26) {
        return { error: true, message: element + " should have max 26 character" }
    }
    return { 'error': false, value: name.trim() };
}

/**
 * 
 * @param {string} accountNumber 
 * @returns 
 */
export function validateAccountNumber(accountNumber) {
    if (accountNumber.trim().length < 15 || accountNumber.trim().length > 16) {
        return { error: true, message: 'Please enter a valid account number' };
    }
    return { 'error': false, value: accountNumber.trim() };

}

/**
 * 
 * @param {string} accountName 
 * @returns 
 */
export function validateAccountName(accountName) {
    if (accountName == null || accountName.trim() == '') {
        return { "error": true, message: 'Please enter account holder name' };
    }

    else if (!accountName.trim().match(/^[a-zA-Z `]+$/)) {
        return { "error": true, message: 'Please enter only alphabets in the account name' };
    }

    else if (accountName.trim().length > 52) {
        return { "error": true, message: 'Please enter the account name not exceeding 52 characters' };
    }
    return { 'error': false, value: accountName.trim() };

}
