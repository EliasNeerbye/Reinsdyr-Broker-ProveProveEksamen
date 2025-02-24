/**
 * Phone Number Validator using validator.js
 *
 * This script requires the validator.js library.
 * Install it using: npm install validator
 */

// Import validator library
const validator = require("validator");

// Phone number validation function
function isValidPhoneNumber(phoneNumber) {
    // Countries where Sami people live
    const locales = ["nb-NO", "sv-SE", "fi-FI", "ru-RU"];

    // Test the phone number against each locale
    for (const locale of locales) {
        if (validator.isMobilePhone(phoneNumber, locale)) {
            return true;
        }
    }

    return false;
}

// Function to test a phone number and show detailed results
function testPhoneNumber(phoneNumber) {
    const isValid = isValidPhoneNumber(phoneNumber);

    // Test against individual locales for more information
    const locales = ["nb-NO", "sv-SE", "fi-FI", "ru-RU"];
    const validLocales = [];

    for (const locale of locales) {
        if (validator.isMobilePhone(phoneNumber, locale)) {
            validLocales.push(locale);
        }
    }

    return {
        number: phoneNumber,
        valid: isValid,
        validLocales: validLocales,
        validFormatDescription: validLocales.length > 0 ? `Valid in: ${validLocales.join(", ")}` : "Not valid in any supported locale",
    };
}

// Test numbers
const testNumbers = [
    // Norwegian numbers
    "+47 912 34 567", // Standard format with spaces
    "+4791234567", // No spaces
    "91234567", // No country code
    "912 34 567", // Spaces but no country code
    "47 91234567", // Country code without +
    "+47 41234567", // Different prefix (4)
    "+47 51234567", // Different prefix (5)
    "+47 9123 4567", // Alternative spacing
    "+47-912-34-567", // With hyphens
    "0047 91234567", // With 00 prefix

    // Swedish numbers
    "+46 70 123 45 67", // Standard format with spaces
    "+46701234567", // No spaces
    "0701234567", // Domestic format
    "070 123 45 67", // Domestic format with spaces
    "46701234567", // Country code without +
    "+46 73 123 45 67", // Different prefix (73)
    "+46 76 123 45 67", // Different prefix (76)
    "+46-70-123-45-67", // With hyphens
    "0046701234567", // With 00 prefix

    // Finnish numbers
    "+358 40 123 4567", // Standard format with spaces
    "+358401234567", // No spaces
    "0401234567", // Domestic format
    "040 123 4567", // Domestic format with spaces
    "358401234567", // Country code without +
    "+358 50 123 4567", // Different prefix (50)
    "+358 44 123 4567", // Different prefix (44)
    "+358-40-123-4567", // With hyphens
    "00358401234567", // With 00 prefix

    // Russian numbers
    "+7 912 345 67 89", // Standard format with spaces
    "+79123456789", // No spaces
    "89123456789", // Domestic format (8...)
    "9123456789", // Without trunk prefix
    "7 9123456789", // Country code without +
    "+7 (912) 345-67-89", // Full formatting with parentheses
    "+7 982 345 67 89", // Different region code
    "+7-912-345-67-89", // With hyphens
    "007 9123456789", // With 00 prefix

    // Edge cases and invalid formats
    "+1 555 123 4567", // US number (not a target country)
    "+44 7700 900123", // UK number (not a target country)
    "+12", // Too short
    "123", // Too short
    "12345678", // Generic 8-digit number
    "123456789012345", // 15-digit number (max length)
    "1234567890123456", // 16-digit number (too long)
    "abcdefghij", // Non-numeric
    "+47 abc def", // Mixed letters and numbers
    " +47 123 45 678 ", // With extra whitespace
    "(+47) 123-45-678", // With parentheses
    "+47 12.34.56.78", // With periods
    "+", // Just a plus
    "", // Empty string
    "＋４７　９１２３４５６７", // Fullwidth characters
    "+47 91234567 ext. 12", // With extension
];

// Run tests
console.log("== PHONE NUMBER VALIDATION RESULTS USING VALIDATOR.JS ==");

testNumbers.forEach((number) => {
    const result = testPhoneNumber(number);
    console.log(`${result.number}: ${result.valid ? "VALID" : "INVALID"} - ${result.validFormatDescription}`);
});

// Function you can use to test your own numbers
function validateMyNumber(number) {
    const result = testPhoneNumber(number);
    console.log("=== VALIDATION RESULT ===");
    console.log(`Number: ${result.number}`);
    console.log(`Valid: ${result.valid}`);
    console.log(`${result.validFormatDescription}`);
    return result.valid;
}

// Example usage
console.log("\n== HOW TO USE ==");
console.log("Call validateMyNumber() with any phone number to test it.");
console.log("Example: validateMyNumber('+47 123 45 678')");

// Uncomment to test your own number
// validateMyNumber("+47 123 45 678");
