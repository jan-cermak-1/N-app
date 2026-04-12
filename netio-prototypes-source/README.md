# NETIO iOS App — Interactive Prototypes

Clickable HTML prototypes for the new NETIO mobile application, replacing NETIO Mobile 2. Designed in Figma using the iOS 26 Apple library. These prototypes cover navigation architecture, user flows, and role-based UX.

---

## Files

| File | Role | Description |
|------|------|-------------|
| `netio-prototype-v3-ios.html` | General / base | Full app prototype with all screens |
| `netio-technician-ios.html` | Admin · Technician | Multi-org, device management, groups, config |
| `netio-enduser-ios.html` | End User | Single org, outputs only, read-only schedule |
| `netio-fieldtech-ios.html` | Field Technician | Temporary access, device setup, NFC focus |

---

## How to use

Open any `.html` file in a browser — no server needed, no dependencies. Tap/click to navigate. Best viewed at ~390px wide (iPhone size) or use browser DevTools mobile view.

**Dark mode:** Settings → Appearance → Dark / Light / System. Auto-detects system preference on load.

---

## Role comparison

| Feature | Admin/Tech | End User | Field Tech |
|---------|-----------|----------|------------|
| View outputs & status | ✅ | ✅ | ✅ |
| ON / OFF / Restart | ✅ | ✅ | ✅ |
| View consumption data | ✅ | ✅ (simplified) | ✅ |
| Configure Scheduler | ✅ | ❌ (view only) | ✅ |
| Configure WatchDog | ✅ | ❌ | ✅ |
| Add / remove devices | ✅ | ❌ | ✅ |
| NFC device setup | ✅ | ❌ | ✅ (primary flow) |
| Firmware updates | ✅ | ❌ | ✅ |
| Device groups | ✅ (full CRUD) | ❌ | ❌ (read only) |
| NETIO Cloud config | ✅ | ❌ | ✅ |
| Manage team members | ✅ | ❌ | ❌ |
| Invite users / set roles | ✅ | ❌ | ❌ |
| Custom role editor | ✅ | ❌ | ❌ |
| Organization management | ✅ | ❌ | ❌ |
| Billing / credits | ✅ | ❌ | ❌ |
| Multiple organizations | ✅ (3 orgs) | ❌ (1 org) | ❌ (temp access) |
| Access expiry | ❌ | ❌ | ✅ (24h temp) |

---

## Screens in each prototype

### netio-technician-ios.html (29 screens)
- Devices home (groups + ungrouped)
- Group detail + sub-groups
- New group / Edit group
- Device detail (with fw alert)
- Output detail (full config)
- Device configuration (network / MQTT / power-up)
- NETIO Cloud setup
- Alerts configuration
- Scheduler (interactive grid)
- WatchDog configuration
- Custom role editor
- Firmware update
- Org list (3 orgs)
- Org detail + Credits + Members + Invite
- Reports + Account + Settings + Appearance
- Find devices / NFC / Add manual / Add success

### netio-enduser-ios.html (7 screens)
- Outputs home (by room, local names)
- Output detail (ON/OFF/Restart + metering, read-only schedule)
- Energy (simplified, week chart)
- Account (profile, 1 org read-only)
- Notifications
- Settings (appearance, language, password)
- Appearance picker

### netio-fieldtech-ios.html (14 screens)
- Devices home (attention banner, quick actions, all devices)
- Device detail (diagnostics first, fw alert)
- Output detail (setup mode)
- Device configuration (network + cloud)
- NFC configuration (extended)
- Find devices (LAN scan)
- Add manual / Add success
- Scheduler / WatchDog setup
- Outputs tab
- Account (permissions overview, expiry warning)
- Appearance

---

## Design tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--brand` | `#005f41` (light) / `#00c878` (dark) | Primary color |
| `--bg0` | `#f2f2f7` / `#000` | Page background |
| `--bg1` | `#fff` / `#1c1c1e` | Card background |
| `--lp` | `#000` / `#fff` | Primary label |
| `--ls` | `rgba(60,60,67,.6)` | Secondary label |
| `--sep` | `rgba(60,60,67,.29)` | Separators |

All tokens follow iOS HIG semantic naming and switch automatically with `.dark` class on `#phone`.

---

## Status

- [x] Navigation architecture
- [x] All main flows clickable
- [x] Dark mode (auto + manual)
- [x] 4 user role prototypes
- [ ] Figma components — in progress
- [ ] Android (Material 3) — planned
