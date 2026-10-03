# Project plan: Schema Studio

## Brief

**Type:** Marketing and SEO tool

**Problem:** Structured-data drafts are easier to review when the inputs and generated JSON are visible together.

**Audience:** A developer or SEO specialist preparing a common JSON-LD example.

## Experience flow

1. Arrive at a direct, descriptive introduction.
2. Review the sample interface and its scope before interacting.
3. Try the core control: Draft JSON-LD for four common content types.
4. See a local result or demonstration state without sending a request to a service.

## Interaction

Type-specific forms generate formatted JSON-LD and a copyable script tag.

## Key design decision

Keep data entry explicit and show a reminder to match visible page content.

## Boundaries

JSON-LD syntax output does not guarantee Schema.org completeness, eligibility or rich results.

The tool is intentionally transparent about its input, assumptions and limits. It is a front-end educational prototype, not a substitute for platform data, professional review or controlled measurement.

## Next iteration

Add schema-type-specific validation sourced from a maintained, documented vocabulary.

## Learning goals

- Structure a complete page with meaningful headings, landmarks and labelled controls.
- Separate visual rules in CSS from interaction logic in JavaScript.
- Make states understandable with keyboard controls and live status text.
- Document assumptions and the boundary between a helpful prototype and a production service.
