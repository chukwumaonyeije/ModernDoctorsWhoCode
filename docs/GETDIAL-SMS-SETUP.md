# Get Dial SMS signup

This change adds `/text-updates/`, `/privacy/`, and `/terms/`, with footer links. The campaign's existing purpose and frequency were read from Get Dial on September 24, 2026. The public support email matches Get Dial's existing published program terms.

## Consent flow

The site is static. A visitor enters a mobile number, reads the disclosure, and may select the initially unchecked consent checkbox. Continue without consent leaves them unsubscribed. With consent and a valid number, Continue prepares the opt-in message and instructions. The visitor must send that text from their own phone to +17638787305. Clicking a website button or opening an SMS app is not a completed subscription.

Get Dial's received message is the record: actual sender number, received timestamp, and complete versioned consent text. The browser field is not uploaded or stored. Only the actual sending number is eligible. The site does not send an SMS, claim delivery, or create a separate subscriber database. No new third-party form processor or storage subscription is introduced.

Desktop/mobile SMS composer support varies. The message is always available for manual copying. Without JavaScript the controls are disabled and help links remain available, preventing accidental query-string submission of a number.

## Registration copy

Keep the existing educational campaign description and `SOLE_PROPRIETOR` use case. Replace the earlier web-only message flow with:

> Adult subscribers visit https://www.doctorswhocode.blog/text-updates/, enter their own mobile number, and read the Doctors Who Code (Chukwuma Onyeije) SMS disclosure. The consent checkbox is initially unchecked and optional. It covers educational content, new lesson and article alerts, course or webinar reminders, and occasional account or subscription notices. The form states: Message frequency varies. Message and data rates may apply. Reply STOP to cancel or HELP for help. Consent is not a condition of purchase. Privacy and SMS Terms links appear directly below the disclosure. Continue without checking consent does not enroll the visitor. After checking consent, the visitor reviews a prepared opt-in text and must send it from their own phone to +17638787305. The incoming message in Get Dial records the actual sender number, received timestamp, and full versioned consent wording before any program message is sent. Entering a number, checking the box, or opening an SMS app alone does not enroll anyone. Only the number that sends affirmative consent is eligible. Subscribers may reply STOP to cancel or HELP for help.

Policy URL: https://www.doctorswhocode.blog/privacy/

Terms URL: https://www.doctorswhocode.blog/terms/

Suggested example messages (registration examples, not messages sent by this setup):

- Doctors Who Code: Explore physician technology lessons at https://www.doctorswhocode.blog/courses/. Reply STOP to cancel or HELP for help.
- Doctors Who Code: New articles and educational resources are available at https://www.doctorswhocode.blog/blog/. Reply STOP to cancel or HELP for help.

Capture the live, empty form with `BROWSER_BASE_URL=https://www.doctorswhocode.blog node scripts/capture-sms-opt-in.mjs`. The script saves a PNG under 2 MB and a timestamp/URL record to ignored `test-results/sms/`. It does not submit the form or send a text. Upload the live PNG to Get Dial's Opt-in screenshot field. The application copy must describe the two-step flow, not the superseded web-only flow.

## Before sending program messages

Carrier approval remains required. Keep messages within the registered purpose. Review the received consent message and honor all later STOP/cancellation requests before sending. Do not treat the browser checkbox or a call to the voice bot as proof of SMS consent. Preserve consent records and opt-out records privately; do not add phone numbers, transcripts, or records to this repository. Monitor HELP messages and the published support inbox.

This website change does not install an automatic sender or alter the voice bot. Confirm STOP/HELP handling in the actual sending workflow before enabling automated outbound messages. A real handset send/receive check is still required to verify the last step; automated browser tests intentionally send no messages.

## Validation

- `npm run check`: complete existing build and preservation gate.
- `npx playwright test tests/browser/sms.spec.mjs`: desktop/mobile consent behavior, invalid input, reload reset, no-JavaScript fallback, theme reflow, and automated accessibility checks.
- `node scripts/capture-sms-opt-in.mjs`: local screenshot with the preview server running; set `BROWSER_BASE_URL` for production evidence.

No article bodies, narration, original public assets, redirects, or legacy protected-route entries are changed.
