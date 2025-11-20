# Incident: 2025-11-17 13-37-42

## Summary

Between the hours of **13:37** and **14:22** on **2025-11-17**, approximately **100%** of users encountered “chronological confusion” across all systems. The event was triggered by a code change at **13:37 UTC** introducing a **Linux timestamp display feature** into the dashboard. Unfortunately, the developer misinterpreted the timestamp (in seconds since 1970) as a human-readable date, resulting in users seeing “January 1st, 1970, 00:00:00” everywhere — including billing, support tickets, and the CEO’s calendar.

A bug in the conversion logic caused all time-based events to “travel back in time,” effectively making our database believe it was **the dawn of Unix**. The event was detected by **the Finance Department**, when invoices were suddenly generated for “-55 years ago.” The team rolled back the feature and restarted the timeline, restoring the normal flow of causality.

This **SEV-1** incident affected **everyone**, including developers who temporarily lost faith in linear time.

## Detection

This incident was detected when an **“All Time Low Revenue Alert”** was triggered and **Accounting** was paged.

Next, **DevOps On-Call** was paged because Accounting’s “problem” was apparently caused by the system reporting that every customer’s subscription had expired in 1970. Response was delayed by **12 minutes** as the on-call engineer attempted to Google “how to reboot the universe.”

A **timestamp sanity check** will be added by **Platform Engineering** so that no future system can claim to exist before disco music.

## Impact

For **45 minutes** between **13:37 UTC and 14:22 UTC** on **11/17/2025**, users experienced mass temporal disarray.

This incident affected **all customers** (100% of **dashboard users**), who experienced missing timelines, zero revenue reports, and historical inaccuracies in all logs.

**42 support tickets** and **173 sarcastic tweets** were submitted, mostly including screenshots captioned “Nice throwback, guys.”

## Timeline

All times are UTC.

- _13:37_ – Developer merges “Human-readable timestamps” PR to main.
- _13:38_ – Dashboard proudly shows “Last updated: 00:00:00, January 1, 1970.”
- _13:40_ – QA assumes it’s a timezone bug and goes for coffee.
- _13:45_ – Accounting reports revenue chart looks “a bit prehistoric.”
- _13:50_ – PagerDuty triggers for “Zero Transactions in the Last 55 Years.”
- _14:00_ – Engineering confirms timestamps are displayed raw (e.g., “1731417462”) and are being used in SQL queries as real datetimes.
- _14:10_ – Rollback initiated, though Jenkins timestamps claim rollback started in 1969.
- _14:22_ – All systems restored; users once again inhabit the present.
- _14:30_ – Developer apologizes, claiming “I thought Linux time was cool.”

## Response

After receiving the page at **13:50 UTC**, **on-call DevOps engineer (Bob)** joined the incident bridge at **13:53 UTC**.

Bob quickly realized the root cause involved timestamps, uttered “oh no, not again,” and called in **Backend Specialist Alice** at **13:55 UTC**, who confirmed that all timestamps were being rendered as integers instead of formatted strings.

Alice manually reverted the PR using the “time-travel” feature (git revert) and purged all references to `new Date(0)`.

## Root cause

An overzealous developer introduced a “Linux timestamp view” without converting seconds since epoch to human-readable format. The system accepted the raw integer as a legitimate date, confusing downstream systems into thinking it was **January 1, 1970** — also known as “the beginning of everything.”

## Resolution

The team restored service by rolling back the timestamp change, clearing cached epoch values, and reindexing time-series data. Once the timeline was re-synchronized with reality, the universe continued normally.

## Prevention

This same root cause nearly occurred during the “Leap Second Fiasco of 2022,” when the same developer asked, “Wait, seconds can leap?”

## Action items

1. Add unit tests ensuring all timestamps are formatted before rendering (assigned to Alice, due 2025-11-25).
2. Introduce monitoring for sudden drops in chronological consistency (Platform Eng).
3. Schedule a mandatory training session titled **“Unix Time: Why You Shouldn’t Set It Free.”**
4. Update code review checklist to include “Does this change break time?”
