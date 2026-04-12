# NETIO App Prototypes — Technical Documentation

## Architecture

All prototypes are single-file HTML applications with no external dependencies. No build step, no server required — open in any browser.

### File structure

```
netio-prototype-v3-ios.html   ~99 KB   Base prototype (all roles combined)
netio-technician-ios.html    ~107 KB   Admin/Technician role
netio-enduser-ios.html        ~54 KB   End User role
netio-fieldtech-ios.html      ~74 KB   Field Technician (temp access)
README.md                          Overview and role comparison
CONTEXT.md                         Full project context
TECHNICAL.md                       This file
```

---

## How the prototype works

### Screen system

Each screen is a `<div class="scr">` absolutely positioned inside `.phone`. Visibility is controlled by the `on` class:

```css
.scr { opacity: 0; pointer-events: none; transform: translateX(44px); }
.scr.on { opacity: 1; pointer-events: all; transform: translateX(0); }
.scr.out { opacity: 0; transform: translateX(-20px); }
```

Transitions use `cubic-bezier(.4,0,.2,1)` — matches iOS UIKit spring behavior.

### Navigation functions

```javascript
go(screenId)     // Push screen onto stack + animate
back()           // Pop stack, show previous screen
tab(tabKey)      // Reset stack, switch to tab root screen
show(screenId)   // Internal: apply .on class
```

### Tab mapping

```javascript
const tabs = {
  out: 's-out',   // Outputs or Devices (role-dependent)
  dev: 's-dev',   // Outputs or Energy (role-dependent)
  nrg: 's-nrg',   // Energy
  acc: 's-acc'    // Account
};
```

### Sheet system

```javascript
openSheet(id)      // Add .on class to overlay
closeSheet(el)     // Remove .on class from overlay element
```

Bottom sheets use `cubic-bezier(.32,.72,0,1)` for the slide-up spring.

### Dark mode

Applied as `.dark` class on `#phone` div only — does not affect the page background. This ensures the phone frame stays dark while the stage background is always dark.

```javascript
setAppear('light')    // Force light
setAppear('dark')     // Force dark
setAppear('system')   // Follow prefers-color-scheme
```

Auto-detected on `DOMContentLoaded` via `window.matchMedia('(prefers-color-scheme: dark)')`. Listens for system theme changes via `addEventListener('change')`.

---

## CSS architecture

### Design tokens (CSS custom properties)

All colors are semantic — defined once in `:root` and overridden in `.dark {}`:

```css
:root {
  --brand: #005f41;           /* Primary green */
  --bg0: #f2f2f7;             /* Page background (grouped) */
  --bg1: #fff;                /* Card background */
  --lp: #000;                 /* Label primary */
  --ls: rgba(60,60,67,.60);   /* Label secondary */
  --lt: rgba(60,60,67,.30);   /* Label tertiary */
  --sep: rgba(60,60,67,.29);  /* Separator */
}

.dark {
  --brand: #00c878;
  --bg0: #000;
  --bg1: #1c1c1e;
  --lp: #fff;
  /* ... */
}
```

Dark mode header/footer overrides:
```css
.dark .sb { background: #111; }    /* Status bar */
.dark .nb { background: #111; }    /* Nav bar */
.dark .tb-bar { background: #111; } /* Tab bar */
```

### Spacing
All layout uses `16px` horizontal padding (matching 20pt safe area in points at 2x). No spacing scale variables — kept inline for prototype flexibility.

### Typography
`-apple-system` font stack maps to SF Pro on iOS/macOS. No web fonts needed.

Key sizes: 17px body, 15px secondary body, 13px caption, 12px label, 10px tab label.

### Component classes

| Class | Component |
|-------|-----------|
| `.row` | Standard list row with tap state |
| `.oc` | Output cell (with icon, name, watts, toggle) |
| `.dc` | Device card (with icon, name, status) |
| `.trow` | Toggle row |
| `.nc` | Notification cell |
| `.mt` | Metric tile |
| `.at` | Action tile (in action strip) |
| `.sst` | Summary strip tile |
| `.card` | Grouped card container |
| `.tog` | iOS-style toggle switch |
| `.sw` | Output/inline switch |

---

## Scheduler grid

Generated dynamically in `DOMContentLoaded`:

```javascript
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const on = [[8,18],[8,18],[8,18],[8,18],[8,18],[],[]]; // hours on per day
// Creates 7 × 24 = 168 clickable cells
```

Each cell toggles `.on` class on click. CSS:
```css
.scell { height: 14px; background: var(--ft); border-radius: 2px; cursor: pointer; }
.scell.on { background: var(--brand); opacity: .85; }
```

---

## Scan animation

`startScan()` runs when navigating to `s-find` screen. Uses `setInterval` to animate a progress bar from 0% to 100% over ~2 seconds, then reveals found devices list.

```javascript
function startScan() {
  let w = 0;
  const iv = setInterval(() => {
    w += 2; bar.style.width = w + '%';
    if (w >= 100) { clearInterval(iv); showFoundDevices(); }
  }, 40);
}
```

---

## Adding new screens

1. Add `<div class="scr" id="s-myscreen">` inside `.phone`
2. Add status bar, nav bar, content, optional tab bar
3. Navigate to it with `go('s-myscreen')` in any `onclick`
4. Navigate back with `back()`

Minimal screen template:
```html
<div class="scr" id="s-myscreen">
  <div class="sb"><span class="sb-t">9:41</span><div class="sb-i"></div></div>
  <div class="nb">
    <button class="nb-btn" onclick="back()"><svg viewBox="0 0 24 24"><use href="#i-back"/></svg></button>
    <span class="nb-title">Screen title</span>
    <div class="nb-spc"></div>
  </div>
  <div class="cnt">
    <!-- content -->
    <div class="spc"></div>
  </div>
</div>
```

---

## SVG icons

All icons are inline SVG symbols defined once in a hidden `<svg><defs>` block. Referenced via `<use href="#i-name">`. Available icons:

`i-plug, i-dev, i-bolt, i-user, i-bld, i-bell, i-chart, i-doc, i-gear, i-plus, i-back, i-check, i-search, i-shield, i-lock, i-card, i-users, i-moon, i-sun, i-cloud, i-fw, i-folder, i-timer, i-dog, i-tag, i-ip, i-wifi, i-export, i-trash, i-on, i-nfc, i-restart, i-cal, i-logout, i-globe`

To add a new icon:
```html
<symbol id="i-myicon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
  <!-- SVG path -->
</symbol>
```

---

## Known limitations

- **No persistent state** — all toggles reset on page reload
- **No real API** — all data is hardcoded prototype content
- **No animation between tabs** — tabs switch instantly (no slide animation)
- **Scheduler grid** — visual only, no real time/interval calculation
- **Scan animation** — always finds the same 2 hardcoded devices
- **Forms** — input values are not validated or stored

---

## Browser compatibility

Tested in: Safari 17+, Chrome 120+, Firefox 121+

CSS features used: `backdrop-filter`, `mix-blend-mode` (only in Figma-exported code, not in prototypes), CSS custom properties, `@keyframes`.

The prototype does NOT use: ES modules, Fetch/XHR, localStorage, any framework.
