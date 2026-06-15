# PRD: Frederick Talks — Speaker Website Redesign

## Context

Frederick's speaker website (fredericktalks) needs a significant update to convert conference organizers and event bookers. The redesign is driven by PR specialist Jeanne's feedback and timed around Frederick's upcoming Figma Config appearance — his first major name-brand conference. The site must function as a key asset in CFP (Call for Proposals) outreach to land more speaking engagements.

**Inspiration reference:** [vickitan.com](https://www.vickitan.com/) — clean, minimal, category-labeled sections, strong name-dropping of companies, upcoming projects featured prominently, and "Learn more" CTAs. The site uses a section-label pattern (e.g., "Design", "Research", "Speaking") with short descriptive text beside each.

---

## Current Tech Stack (do not change)

- **Framework:** Vite + vanilla JS
- **UI:** Alpine.js for interactivity (modals, carousels, tooltips)
- **Styling:** Tailwind CSS v3
- **Fonts:** Signifier (serif, headings), Familjen Grotesk (sans, body)
- **Colors:** Primary blue `#0D3DFF`, gray-50 `#f7f7f7`, black
- **Content:** JSON-driven via `/public/data/content.json`
- **Deployment:** Vercel (with serverless email API at `/api/send-email`)
- **Analytics:** Vercel Analytics

---

## Design Principles (preserve from current site)

- Clean, editorial aesthetic with generous whitespace
- PP Editorial New as the primary display font
- Pixel-art SVG icons as a signature visual element
- Split layout on desktop (content left, imagery right) — but this should evolve (see below)
- Mobile-first responsive design
- Content-driven from JSON (all copy, talk data, images editable via `content.json`)

---

## New Page Structure

The site should follow this narrative flow as defined by Jeanne:

**Who is Frederick → What does he speak on → Who trusts him → How to book him**

### Section 1: Hero / Identity

**Purpose:** Immediately answer "who is this person and why should I care?"

**Current state:** Two paragraphs of bio text + "Available for talks and sessions globally" tagline.

**Changes needed:**

1. **Expand the bio/positioning statement.** The current one-liner ("Works with technical product teams to build critical, AI-driven design systems") is good but needs more context so bookers understand Frederick's unique angle immediately. Write a 2-3 sentence expanded positioning that covers:
   - He's a design studio founder (link to edl.dk, keep existing)
   - His specialty: the intersection of AI, design systems, and product engineering
   - His perspective: practical, technical, commercial — not theoretical
   - He builds and ships real systems, not just talks about them
   - Example expanded copy direction: "Frederick is the founder of EDL, a design studio that builds AI-driven design systems for technical product teams. He sits at the intersection of design, engineering, and product strategy — where most speakers don't. His talks are grounded in real production systems, not theory."

2. **Add a prominent Figma Config callout.** This should be visually distinct (e.g., a badge, banner, or highlighted line) that says something like:
   - "Speaking at Figma Config 2026" with the Figma logo or a conference badge
   - This should be near the top, visible without scrolling
   - Even before the event happens, this is social proof

3. **Add a "forthcoming book" teaser** (inspired by Vicki Tan's card game teaser). Something like:
   - "Author of [Book Title TBD] on design engineering — forthcoming"
   - Keep it subtle but present. Use a placeholder title if needed.

4. **Hero image area** should feature Frederick's strongest speaking/stage photo. Prioritize images of him on stage or presenting. Add placeholder images with descriptive alt text for any we don't have yet:
   - `alt="Frederick speaking on stage at a tech conference"` (placeholder)
   - `alt="Frederick presenting to a large audience at Figma Config 2026"` (placeholder)

### Section 2: Talk Topics / What He Speaks On

**Purpose:** Show bookers exactly what they can book Frederick for.

**Current state:** Two talks listed with descriptions and tags. This is a solid base.

**Changes needed:**

1. **Add speaking format indicators** to each talk (or as a global section). Formats to include:
   - Keynote (30-60 min)
   - Workshop (half-day / full-day)
   - Team session (private, on-site)
   - Panel / Fireside chat
   - Podcast guest

2. **Refine talk cards** to include:
   - Talk title (keep existing)
   - Short description (keep existing, refine copy)
   - Format tags (Keynote, Workshop, etc.) alongside existing tags (On-site, Teams, Conferences, Leadership)
   - Duration indicator
   - An "audience fit" line (e.g., "Best for: Engineering leads, Design managers, Product teams")

3. **Add a third talk/topic** related to the upcoming book on design engineering. This positions Frederick for future CFPs. Suggested title direction:
   - "The Design Engineering Gap" or "Why Your Design System Needs an Engineer's Mindset"
   - Tag it as: Conferences, Leadership, Keynote
   - Description should tie into the book thesis

4. **Consider adding a "Custom Talk" option** — a card that says something like "Have a specific topic in mind? Frederick tailors talks to your team's challenges." This opens the door for bespoke bookings.

### Section 3: Social Proof / Who Trusts Him

**Purpose:** Build credibility and trust with bookers. This section does not exist on the current site and is the biggest gap.

**Changes needed:**

1. **Conference logo bar / "As seen at" section.** Display logos or names of conferences/events Frederick has spoken at. Include:
   - Figma Config 2026 (prominent, even pre-event — use "Upcoming" badge)
   - Any other events, meetups, podcasts, webinars he's done
   - Use placeholder logos with alt text for events we need assets for:
     - `alt="Figma Config logo"` (placeholder)
     - Add more as Frederick provides them

2. **Testimonial / organizer quote.** Even a single strong quote from an event organizer significantly increases trust. Structure:
   - Pull quote with quotation marks
   - Name, title, organization
   - Placeholder: Add a `testimonials` array to `content.json` with structure: `{ "quote": "...", "name": "...", "title": "...", "org": "...", "avatar": "..." }`
   - If no real testimonial exists yet, build the component and use a placeholder that says "Testimonial coming soon" or leave the section hidden until populated (controlled by a flag in content.json like `"showTestimonials": true`)

3. **Audience size / stats indicators.** If available, show numbers like:
   - "Spoken to 500+ designers and engineers"
   - "Worked with teams at [company names]"
   - These can be simple text stats, not necessarily a fancy component

4. **Video embed or link to a talk recording / social media clips.** Frederick has YouTube shorts — link to or embed the strongest one. A 60-second clip of Frederick speaking is worth more than any written testimonial. Structure in content.json:
   - `"videos": [{ "url": "...", "thumbnail": "...", "title": "...", "duration": "..." }]`

5. **Client / company logos** (if applicable). If Frederick has done sessions for recognizable companies, show their logos. This is separate from conference logos.

### Section 4: Booking CTA

**Purpose:** Make it dead simple and urgent to book Frederick.

**Current state:** "Send request" button opens a modal with name/email/phone form. The CTA copy is generic.

**Changes needed:**

1. **Update CTA copy** from "Send request" to something with urgency and specificity:
   - Primary CTA: **"Booking Q3–Q4 2026 — Check Availability"**
   - This signals he's in demand and has a timeline
   - Update this in content.json so it's easy to change seasonally

2. **Add a secondary CTA** for lighter-touch engagement:
   - "Download speaker kit" (link to a PDF one-pager — can be a placeholder for now)
   - Or: "View speaking reel" (link to YouTube)

3. **Update the booking modal:**
   - Keep the form fields (name, work email, phone)
   - Add a dropdown or checkbox for **event type**: Conference, Corporate event, Workshop, Podcast, Other
   - Add an optional **"Tell us about your event"** textarea
   - Update the subtitle from "No commitment before our initial chat" to something warmer but still low-pressure, e.g., "Frederick's team typically responds within 24 hours."

4. **The CTA should appear in two places:**
   - As a sticky/fixed element (e.g., a bar at the bottom on mobile, or a persistent button)
   - Within the natural page flow after the social proof section

### Section 5: Footer

**Current state:** Links to Studio, LinkedIn, YouTube.

**Changes needed:**

1. **Add a short bio line** in the footer (e.g., "Frederick is a design studio founder based in [city]. He speaks globally on AI, design systems, and product strategy.")
2. **Add email address** for direct booking inquiries (or management contact)
3. **Keep existing links** (Studio, LinkedIn, YouTube)
4. **Add link to speaker kit PDF** (placeholder)

---

## New Content.json Structure

The `content.json` file needs to be extended. Here's the new top-level structure:

```json
{
  "site": { ... },
  "hero": {
    "intro": { ... },
    "availability": { ... },
    "configCallout": {
      "text": "Speaking at Figma Config 2026",
      "logo": "/images/figma-config-logo.svg",
      "url": "https://config.figma.com/"
    },
    "book": {
      "text": "Author of [Book Title TBD] on design engineering — forthcoming",
      "show": true
    }
  },
  "talks": [
    {
      "id": 1,
      "title": "...",
      "description": "...",
      "formats": ["Keynote", "Workshop"],
      "duration": "30-90 min",
      "audienceFit": "Engineering leads, Design managers, Product teams",
      "tags": [...],
      "actions": { ... },
      "modal": { ... }
    }
  ],
  "socialProof": {
    "showSection": true,
    "conferences": [
      { "name": "Figma Config 2026", "logo": "/images/logos/figma-config.svg", "url": "...", "upcoming": true }
    ],
    "testimonials": [
      { "quote": "...", "name": "...", "title": "...", "org": "...", "avatar": "..." }
    ],
    "stats": [
      { "number": "500+", "label": "designers and engineers reached" }
    ],
    "videos": [
      { "url": "...", "thumbnail": "...", "title": "...", "duration": "..." }
    ],
    "showTestimonials": false,
    "showVideos": true,
    "showStats": true
  },
  "booking": {
    "ctaText": "Booking Q3–Q4 2026 — Check Availability",
    "secondaryCta": {
      "text": "Download Speaker Kit",
      "url": "/speaker-kit.pdf"
    },
    "modal": {
      "eventTypes": ["Conference", "Corporate Event", "Workshop", "Podcast", "Other"],
      "subtitle": "Frederick's team typically responds within 24 hours."
    }
  },
  "footer": {
    "bio": "Frederick is a design studio founder based in Copenhagen. He speaks globally on AI, design systems, and product strategy.",
    "email": "speaking@edl.dk",
    "links": [...]
  },
  "images": [...]
}
```

---

## Image Assets Needed

For each image below, add a placeholder `<img>` or `<div>` with the specified alt text. Use a neutral gray background (`bg-gray-200`) for placeholders so they're visually obvious.

| Asset | Alt Text | Status |
|-------|----------|--------|
| Hero speaking photo | "Frederick speaking on stage at a tech conference" | Placeholder needed |
| Figma Config stage photo | "Frederick presenting at Figma Config 2026" | Placeholder needed (future) |
| Figma Config logo | "Figma Config logo" | Placeholder needed |
| Client/event logos | "Logo of [event name]" per logo | Placeholder needed |
| Testimonial avatar | "Photo of [name], [title]" | Placeholder needed |
| Video thumbnail | "Frederick speaking — video thumbnail" | Placeholder needed |
| Book cover | "Cover of Frederick's forthcoming book on design engineering" | Placeholder needed |
| Existing: frederick-webinar.jpg | Keep | Exists |
| Existing: frederick-library.jpg | Keep | Exists |
| Existing: frederick-podcast.jpg | Keep | Exists |

---

## Implementation Notes

1. **All new content must be driven by `content.json`** — no hardcoded copy in HTML. This is the existing pattern and must be maintained.
2. **Preserve the existing Alpine.js component architecture.** New sections should follow the same pattern: data loaded from JSON, rendered via JS, interactivity via Alpine.
3. **Preserve existing modal and form functionality.** The Vercel serverless email endpoint (`/api/send-email`) should continue to work. Extend the payload to include new fields (event type, message).
4. **Image placeholders** should use a consistent pattern: a `div` with `bg-gray-200` background, the alt text visible as centered gray text, and proper `alt` attributes for when real images are swapped in.
5. **The social proof section should gracefully degrade.** If `showTestimonials` is false in content.json, that subsection should not render. Same for videos and stats. This lets Frederick populate the site incrementally.
6. **The sticky CTA** should only appear after the user has scrolled past the hero section. Use Alpine.js + Intersection Observer for this.
7. **Mobile layout:** The current carousel-on-top pattern works. The new sections should stack naturally. The sticky CTA on mobile should be a bottom bar.
8. **Maintain the existing split layout on desktop** for the hero, but the new sections below (talks, social proof, booking) should be full-width to accommodate logos, testimonials, and richer content.
9. **Keep the pixel-art SVG icon style** for any new icons (formats, stats, etc.).
10. **The page title and meta description** should be updated to include "Figma Config" and "keynote speaker" for SEO value in booker searches.

---

## Acceptance Criteria

- [ ] Hero section has expanded bio positioning Frederick's unique angle
- [ ] Figma Config callout is visible above the fold
- [ ] Forthcoming book teaser is present
- [ ] All three talks are listed with format indicators and audience fit
- [ ] Social proof section exists with conference logos area (even if placeholder)
- [ ] Testimonial component exists (hidden until populated via content.json flag)
- [ ] Video embed/link section exists
- [ ] Primary CTA reads "Booking Q3–Q4 2026 — Check Availability" (or similar urgency copy)
- [ ] Booking modal includes event type selector and optional message field
- [ ] Secondary CTA for speaker kit exists
- [ ] Sticky CTA appears on scroll
- [ ] Footer includes bio line and contact email
- [ ] All new content is driven by content.json
- [ ] All placeholder images have descriptive alt text and gray backgrounds
- [ ] Mobile responsive — all new sections stack and work on mobile
- [ ] Existing functionality preserved (carousel, tooltips, modal, email form)
- [ ] Page title and meta description updated

---

## Out of Scope

- Complete visual redesign (preserve existing aesthetic)
- New hosting or deployment changes
- Speaker kit PDF creation (just link placeholder)
- Actual testimonial content (Frederick to provide)
- Actual conference logos (Frederick to provide)
- Book title or cover design (use placeholders)
- Video production (just embed/link existing YouTube content)
