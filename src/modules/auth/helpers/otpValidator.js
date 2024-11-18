export function otpValidator(otp) {
  if (!otp) return "OTP can't be empty.";
  if (otp.length < 6) return 'Invalid OTP';
  return '';
}