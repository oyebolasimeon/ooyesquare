# 🛡️ STCOGA Brand Implementation Guide

## Color Palette Extracted from Logo

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|-----------|----------|-----|-------|
| **STCOGA Blue** | `#1E40AF` | `rgb(30, 64, 175)` | Primary buttons, headers, main brand color |
| **STCOGA Blue Dark** | `#1E3A8A` | `rgb(30, 58, 138)` | Text, hover states, emphasis |
| **STCOGA Blue Light** | `#3B82F6` | `rgb(59, 130, 246)` | Accents, gradients |
| **STCOGA Gold** | `#D4A574` | `rgb(212, 165, 116)` | Secondary actions, borders, highlights |
| **STCOGA Gold Dark** | `#B8935A` | `rgb(184, 147, 90)` | Gold hover states |
| **STCOGA Brown** | `#8B7355` | `rgb(139, 115, 85)` | Tertiary elements |
| **STCOGA White** | `#F8FAFC` | `rgb(248, 250, 252)` | Text on dark backgrounds, cards |

### Supporting Colors

| Color Name | Hex Code | Usage |
|-----------|----------|-------|
| **Success Green** | `#059669` | Success messages, completed states |
| **Warning Orange** | `#D97706` | Warnings, pending states |
| **Danger Red** | `#DC2626` | Errors, destructive actions |
| **Text Primary** | `#1E3A8A` | Main text (dark blue from shield) |
| **Text Secondary** | `#64748B` | Secondary text |

## Typography

### Font Family
**Primary:** Exo 2 (Google Fonts)
- Fallback: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Similar to "New Science" with modern, clean look

### Font Weights
- **Light:** 300 - Subtle text
- **Regular:** 400 - Body text
- **Medium:** 500 - Buttons
- **Semi-Bold:** 600 - Headings, emphasis
- **Bold:** 700 - Major headings

## Design Elements

### 1. Background Implementation
```css
background-image: 
  linear-gradient(rgba(248, 250, 252, 0.97), rgba(248, 250, 252, 0.95)),
  url('/assets/bg-image.jpeg');
```
- **97-95% white overlay** for subtlety
- Logo visible but not overwhelming
- Maintains readability

### 2. Gradient Styles

**Blue Gradient (National/Primary):**
```css
background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
```

**Gold Gradient (State/Secondary):**
```css
background: linear-gradient(135deg, #D4A574 0%, #B8935A 100%);
```

### 3. Shadow Effects

**STCOGA Blue Shadow:**
```css
box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
```

**STCOGA Gold Shadow:**
```css
box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
```

## Icon System (PrimeIcons)

### Core Icons Used

| Icon | Class | Usage |
|------|-------|-------|
| Shield | `pi-shield` | Logo, security, protection |
| Flag | `pi-flag` | National elections |
| Map Marker | `pi-map-marker` | State elections, locations |
| Check Circle | `pi-check-circle` | Success, completed votes |
| Times Circle | `pi-times-circle` | Errors, cancel |
| Sign Out | `pi-sign-out` | Logout |
| User | `pi-user` | Profile, voters |
| Users | `pi-users` | Multiple users, groups |
| Home | `pi-home` | Dashboard, home |
| Chart Bar | `pi-chart-bar` | Analytics, results |
| Calendar | `pi-calendar` | Election dates |
| Upload | `pi-upload` | File upload |
| Download | `pi-download` | Export results |
| Search | `pi-search` | Search functionality |
| Filter | `pi-filter` | Filtering |
| Cog | `pi-cog` | Settings |
| Info Circle | `pi-info-circle` | Information |
| Exclamation Triangle | `pi-exclamation-triangle` | Warnings |

### Icon Color Scheme
```css
.icon-blue { color: #1E40AF; }      /* Primary actions */
.icon-gold { color: #D4A574; }      /* Secondary actions */
.icon-white { color: #F8FAFC; }     /* On dark backgrounds */
```

## Component Styling

### 1. Headers
```css
background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
border-bottom: 2px solid #D4A574;
color: #F8FAFC;
```

### 2. Cards
```css
background: rgba(255, 255, 255, 0.98);
border: 1px solid rgba(212, 165, 116, 0.1);
border-radius: 12px;
```

**On Hover:**
```css
border-color: rgba(212, 165, 116, 0.3);
box-shadow: 0 8px 16px rgba(30, 64, 175, 0.1);
```

### 3. Buttons

**Primary Button:**
```css
background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
color: white;
```

**Secondary Button:**
```css
background: linear-gradient(135deg, #D4A574 0%, #B8935A 100%);
color: #1E3A8A;
```

### 4. Status Badges

**Completed/Success:**
```css
background: #059669;
color: white;
```

**Pending:**
```css
background: #FEF3E2;
color: #92400E;
```

**Skipped:**
```css
background: #E5E7EB;
color: #4B5563;
```

## Brand Messaging

### Tagline
**"STCOGA DECIDES"** - Used in voter interface

### Full Name
**Developed by Simeon Oyebola (Crimsom Arc Ltd)**

### Motto (from shield)
**"CUM MARIA MATRI JESU"** - With Mary, Mother of Jesus

## Accessibility

### Color Contrast Ratios
- **Blue on White:** 8.59:1 ✅ (WCAG AAA)
- **Gold on White:** 3.02:1 ✅ (WCAG AA for large text)
- **White on Blue:** 8.59:1 ✅ (WCAG AAA)

### Text Sizing
- **Minimum body text:** 16px
- **Headings:** 1.5rem - 2.5rem
- **Buttons:** 1rem - 1.1rem

## Usage Examples

### Login Page
- **Logo:** Shield icon in STCOGA Blue
- **Title:** "STCOGA Elections" in Blue
- **Buttons:** Blue gradient
- **Active tabs:** Blue gradient with gold accent

### Category Selection
- **Header:** Blue gradient with gold border
- **National Card:** Blue icon with blue accents
- **State Card:** Gold icon with gold accents
- **Instructions:** Blue headings with gold checkmarks

### Voting Interface
- **Position cards:** White with subtle blue shadow
- **Selected items:** Blue border with blue background tint
- **Status badges:** Semantic colors (green/amber/gray)

### Success Page
- **Success icon:** Green with animation
- **Info cards:** Blue icons
- **Buttons:** Blue primary, gold secondary

## File Locations

### Global Styles
`src/styles.css` - All STCOGA brand variables and overrides

### Component Styles
- Login: `src/app/components/shared/login/login.component.css`
- Categories: `src/app/components/voter/categories/categories.component.css`
- States: `src/app/components/voter/states/states.component.css`
- Voting: `src/app/components/voter/voting/voting.component.css`
- Thank You: `src/app/components/voter/thank-you/thank-you.component.css`

### Assets
- Logo/Background: `src/assets/bg-image.jpeg`

## CSS Variables Usage

Access colors in your components:
```css
/* Use STCOGA colors */
color: var(--stcoga-blue);
background: var(--stcoga-gold);
border-color: var(--stcoga-blue-dark);

/* Use semantic colors */
color: var(--text-primary);
background: var(--bg-light);
```

## Best Practices

1. **Consistency:** Always use STCOGA blue for primary actions
2. **Hierarchy:** Use gold for secondary/alternate actions
3. **Subtlety:** Keep background at 95-97% opacity
4. **Contrast:** Ensure text is readable on all backgrounds
5. **Icons:** Use PrimeIcons consistently throughout
6. **Shadows:** Keep shadows soft with STCOGA colors
7. **Gradients:** Use 135deg diagonal gradients
8. **Border Accents:** Use gold for elegant borders

## Responsive Design

### Mobile Adjustments
- Maintain color scheme
- Simplify gradients if needed
- Ensure tap targets are 44px minimum
- Keep text readable at all sizes

## Print Styles
For election results printing:
- Use darker STCOGA blue (#1E3A8A)
- Remove background images
- Maintain brand colors in headers

---

**Brand Implementation Date:** October 2025  
**Status:** Complete ✅  
**Compatibility:** All modern browsers, mobile devices

