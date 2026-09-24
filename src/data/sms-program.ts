/** Public disclosures matching the Get Dial campaign retrieved September 24, 2026. */
export const smsProgram = {
  brand: 'Doctors Who Code',
  operator: 'Chukwuma Onyeije',
  number: '+17638787305',
  displayNumber: '(763) 878-7305',
  supportEmail: 'onyeije@gmail.com',
  version: '2026-09-24',
  purpose: 'educational content, new lesson and article alerts, course or webinar reminders, and occasional account or subscription notices',
  frequency: 'Message frequency varies.',
  rates: 'Message and data rates may apply.',
  optOut: 'Reply STOP to cancel or HELP for help.',
  privacyUrl: 'https://www.doctorswhocode.blog/privacy/',
  termsUrl: 'https://www.doctorswhocode.blog/terms/',
} as const;

export const smsConsentText = `I agree to receive text messages from ${smsProgram.brand} (${smsProgram.operator}) about ${smsProgram.purpose}. ${smsProgram.frequency} ${smsProgram.rates} ${smsProgram.optOut} Consent is not a condition of purchase.`;
