# Get Dial SMS signup

This change adds `/text-updates/`, `/privacy/`, and `/terms/`, with footer links. The campaign's existing purpose and frequency were read from Get Dial on September 24, 2026. The public support email matches Get Dial's existing published program terms.

## Consent flow

The site is static. A visitor enters a mobile number, reads the disclosure, and may select the initially unchecked consent checkbox. Continue without consent leaves them unsubscribed. With consent and a valid number, Continue prepares the opt-in message and instructions. The visitor must send that text from their own phone to +17638787305. Clicking a website button or opening an SMS app is not a completed subscription.

Get Dial receives the actual sender number, timestamp, and complete versioned consent text. The browser field is not uploaded or stored. A Vercel function at `/api/getdial-sms` verifies signed incoming events and keeps consent, suppression, and dispatch records in private Vercel Blob storage. Only the actual sending number is eligible. The handler sends enrollment confirmations and requested STOP/HELP replies; it does not send article campaigns or modify the voice bot.

Desktop/mobile SMS composer support varies. The message is always available for manual copying. Without JavaScript the controls are disabled and help links remain available, preventing accidental query-string submission of a number.

## Registration copy

Keep the existing educational campaign description and `SOLE_PROPRIETOR` use case. Replace the earlier web-only message flow with:

> Adult subscribers visit https://www.doctorswhocode.blog/text-updates/, enter their own mobile number, and read the Doctors Who Code SMS disclosure. The optional consent checkbox is initially unchecked. The disclosure covers educational content, lesson/article alerts, course/webinar reminders, and account/subscription notices; message frequency varies; message and data rates may apply; reply STOP to cancel or HELP for help; consent is not a condition of purchase. Privacy and SMS Terms links appear beside the form. After selecting consent and Continue, visitors see +17638787305 and the complete prepared signup text beginning "DWC OPT IN 2026-09-24:". They must send that entire text, including the affirmative consent disclosure, from their own phone. Sending only START, JOIN, or the prefix does not enroll them. Entering a number, checking the box, or opening the texting app alone does not enroll them. Get Dial receives the sender number and full text. Our signed-webhook handler records versioned consent and received time and automatically responds: "Doctors Who Code: You are subscribed to educational text updates and account notices. Message frequency varies. Message and data rates may apply. Reply HELP for help or contact onyeije@gmail.com. Reply STOP to cancel." STOP records an opt-out; HELP returns support details. Outbound delivery begins only after carrier approval.

Policy URL: https://www.doctorswhocode.blog/privacy/

Terms URL: https://www.doctorswhocode.blog/terms/

Suggested example messages (registration examples, not messages sent by this setup):

- Doctors Who Code: [LessonTitle] is ready at [LessonURL]. Questions? Call [SupportNumber]. Reply STOP to cancel or HELP for help.
- Doctors Who Code: Read [ArticleTitle] at [ArticleURL]. Questions? Call [SupportNumber]. Reply STOP to cancel or HELP for help.

These templates use content variables, not a subscriber name: the form does not collect names. `[SupportNumber]` is +17638787305. Lesson and article URLs resolve to the matching page on https://www.doctorswhocode.blog. Keep both the URL and phone-number declarations selected if using these templates. These are registration examples, not an implemented automatic outbound campaign.

Capture the live form with `BROWSER_BASE_URL=https://www.doctorswhocode.blog node scripts/capture-sms-opt-in.mjs`. The script saves `getdial-opt-in-live-complete.png` with unchecked consent and all three signup instructions, including the destination number and exact text prefix. It also saves `getdial-opt-in-live-complete-step-2.png`, showing the prepared-message screen using a reserved fictional example number. Each PNG is under 2 MB with a timestamp/URL record in ignored `test-results/sms/`. It only prepares the text locally in the browser; it never opens the texting app or sends a text. Replace the old attachment with the new complete PNG. The application copy must describe the two-step flow, not the superseded web-only flow.

## Before sending program messages

Carrier approval remains required. Keep messages within the registered purpose. Review the received consent message and honor all later STOP/cancellation requests before sending. Do not treat the browser checkbox or a call to the voice bot as proof of SMS consent. Preserve consent records and opt-out records privately; do not add phone numbers, transcripts, or records to this repository. Monitor HELP messages and the published support inbox.

The handler is reactive only. All future campaign senders must check the private subscriber's latest opt-out state; sending directly through another tool bypasses this handler's suppression records. A real handset send/receive check after carrier approval is required to verify delivery; automated tests intentionally send no messages. Consent received while carriers block the number is recorded but its confirmation is not queued for later delivery. Ask the subscriber to repeat the complete signup text after approval.

## Handler operations

Production environment variables: `GETDIAL_API_KEY`, `GETDIAL_NUMBER_ID`, `GETDIAL_WEBHOOK_SECRET`, `DWC_SMS_RECORD_KEY`, and `BLOB_READ_WRITE_TOKEN`. Never put these in public Astro variables, browser code, or source control. Keep the record key stable: it determines private record paths.

The private store is `dwc-sms-consent`. The webhook subscribes only to `message.received`. A signed provider ping verifies the endpoint and private storage without sending SMS. Invalid signatures are rejected before storage; internal test events, other destinations, group traffic, and unrelated incoming content are ignored. This is not a HIPAA patient-data system. Do not send patient information.

`sms/events/` retains recognized consent/opt-out/help metadata; `sms/subscribers/` holds the latest consent or opt-out with atomic ETag updates. A newer STOP supersedes delayed consent. `sms/dispatch/` claims each inbound message before any send attempt; `sms/results/` records API acceptance or `needs_review`. API acceptance is not proof of carrier delivery. `sms/blocked/` records approval-related suppression. Storage failures return 503 for provider retry.

Get Dial's send API has no idempotency key. An interrupted or ambiguous dispatch is deliberately not retried automatically. Inspect `sms/dispatch/` entries with missing results and `needs_review` results alongside Get Dial message history before any manual resend. Logs contain hashed record identifiers only. Monitor Vercel function errors and webhook delivery failures. The handler does not add a recurring monitor.

## Validation

- `npm run check`: complete existing build and preservation gate.
- `npx playwright test tests/browser/sms.spec.mjs`: desktop/mobile consent behavior, invalid input, reload reset, no-JavaScript fallback, theme reflow, and automated accessibility checks.
- `node scripts/capture-sms-opt-in.mjs`: local screenshot with the preview server running; set `BROWSER_BASE_URL` for production evidence.

No article bodies, narration, original public assets, redirects, or legacy protected-route entries are changed.
