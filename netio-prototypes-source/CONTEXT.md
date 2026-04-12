# NETIO App — Project Context

Complete design context for the new NETIO mobile application. This document captures all decisions, data model, navigation architecture, user research, and feature scope agreed during the design phase.

---

## Project overview

**Goal:** Build a new iOS (later Android) mobile application replacing NETIO Mobile 2. The new app achieves full feature parity with NETIO Cloud desktop web application, plus adds all Mobile 2 features.

**Platform:** iOS first, Android later. iOS designed with Figma using the official iOS 26 Apple library. Android will use the Material 3 Figma library (M3 bottom nav bar, not drawer).

**NETIO products a.s.** — Czech manufacturer of smart PDUs (Power Distribution Units), smart power strips and sockets, controllable over LAN/WiFi. Products connect to NETIO Cloud for remote management.

---

## Data model

```
Organization (top level entity)
├── Credits (belong to org, NOT to user — cannot transfer between orgs)
├── Users (members with roles)
│   └── Roles: Admin | User | Custom | Field Technician (temp)
├── Devices (PDU hardware)
│   ├── Groups / Sub-groups (folder structure)
│   └── Outputs (individual sockets, 1–8 per device)
│       ├── State: ON / OFF / Restart (power cycle)
│       ├── Scheduler (weekly time plan, runs LOCALLY in device, cloud independent)
│       ├── WatchDog (ping monitor, auto-restart on fail)
│       ├── Metering: W / A / V / kWh / Hz / PF (metered models only)
│       └── Connection Alert (email on disconnect/restore)
└── Reports (Daily Billing Reports)
```

Key rules:
- One user can belong to multiple organizations
- One device belongs to exactly one organization
- Credits belong to the organization, not individual users
- Credit transfer between organizations is not possible
- Scheduler runs in the device locally — works without internet
- Metering (A current) is available only on premium subscription plans

---

## Credit system

| Action | Cost |
|--------|------|
| Turn ON | 1 credit |
| Turn OFF | 1 credit |
| Restart (power cycle) | 2 credits |
| MQTT message via External API | 1 credit |
| Remove device from Cloud | 1 credit |

- Credits are charged daily based on interactions + connection fee
- Service stops when credits reach 0 (new devices cannot be added, but existing devices remain controllable)
- Welcome Credit: 50 000 credits per new device connected (≈1 year of typical usage)
- Credit refund is not possible

---

## Navigation architecture

### Tab bar (4 tabs)

| Tab | iOS | Android |
|-----|-----|---------|
| Outputs | ☉ Outputs | ⚡ Outputs |
| Devices | 🔌 Devices | 🔌 Devices |
| Energy | ⚡ Energy | 📊 Energy |
| Account | 👤 Account | 👤 Account |

**Note:** Technician view uses Devices as primary tab (home screen). End user uses Outputs as primary tab.

### Header (global)
- NETIO logo (left)
- Organization switcher pill (center-right) → taps open **bottom sheet** (quick switch)
- Search icon (right)

### FAB "+"
- Visible only on Devices tab (technician/admin)
- Opens "Add device" bottom sheet → Find / Manual / NFC / Cloud
- Hidden for end users and field technicians (field tech uses NFC button instead)

### Organization management
- **Header pill** = quick switcher (bottom sheet, select only)
- **Account → Organization** = full management (CRUD, detail, members, credits, delete)

---

## Screen hierarchy

```
Tab: Outputs
└── Output list (flat / grouped)
    └── Output detail
        ├── ON / OFF / Restart
        ├── Metering (W, A, V, kWh, Hz, PF)
        ├── Scheduler → Configure schedule (interactive weekly grid)
        ├── WatchDog → Configure WatchDog
        └── Connection Alert (toggle)

Tab: Devices
├── Group list → Group detail
│   ├── Sub-group list
│   ├── Group control (All ON/OFF/Scheduler)
│   └── Device list → Device detail
│       ├── Output list → Output detail (same as above)
│       ├── Device configuration (network, MQTT, Cloud, power-up)
│       ├── Firmware update
│       ├── Connection alerts config
│       └── Remove device
└── [+ FAB] Add device sheet
    ├── Find devices (LAN scan)
    ├── Add manually (IP + credentials)
    ├── NFC configuration
    └── From NETIO Cloud

Tab: Energy
├── Summary (kWh today, W now, MWh month)
├── 7-day bar chart
├── Per-device breakdown
└── Export data

Tab: Account
├── User profile → Change password, 2FA
├── Organization → Org list
│   └── Org detail
│       ├── Credits → Buy, billing history
│       ├── Members → Invite → Custom role editor
│       ├── Devices
│       ├── Subscription plan
│       ├── Event log (24h billing)
│       └── Delete org
├── Notifications
├── Dashboard (overview, alerts, activity)
├── Reports → Report detail (export)
└── Settings
    ├── Appearance (Light / Dark / System)
    ├── Language
    ├── Notifications (push, alerts, firmware, low credit)
    ├── Security (2FA, SSO)
    ├── About / Privacy
    └── Log Out
```

---

## User roles

### Admin
Full access to everything within the organization.
- All device operations
- Configure Scheduler, WatchDog, Alerts
- Add/remove devices (NFC, LAN, manual, Cloud)
- Manage groups and sub-groups
- Manage users (invite, set roles, remove)
- Custom role editor
- View and manage credits / billing
- Organization settings
- Firmware updates
- NETIO Cloud setup

### User
Operational control only.
- View all devices and outputs
- ON / OFF / Restart outputs
- View consumption data (if subscription allows)
- View schedule (cannot configure)
- No device management
- No user management
- No billing access

### Custom
Fully configurable by Admin via Custom Role Editor.
- Each permission toggleable individually
- Can be restricted to specific groups or specific outputs
- Permissions: view, control, restart, metering, scheduler config, watchdog config, group management, add/remove devices, firmware, invite members, view billing, manage credits

### Field Technician (temporary role)
Time-limited access for on-site service visits.
- Granted by Admin with expiry (default 24h, configurable)
- Can view all devices, add devices, configure outputs, install firmware, NFC setup
- Cannot manage members, billing, organization settings
- Account screen shows access level and expiry
- FAB replaced by NFC button (primary field tech workflow)

---

## Features: Mobile 2 vs. New App

### Features carried over from Mobile 2
- ON / OFF / Restart each output (LAN + Cloud)
- Show power consumption (A, W, Wh) on supported devices
- Enable/disable Scheduler per output
- Group outputs, group control (ON/OFF, Scheduler enable/disable)
- Sorting of outputs within groups
- LAN discover (scan local network)
- Add devices from NETIO Cloud

### Features NEW (not in Mobile 2, from NETIO Cloud desktop)
- **Scheduler configuration** — full weekly grid editor (Mobile 2 only toggle on/off)
- **WatchDog configuration** — IP, interval, action, delay, retries
- **User management** — invite, roles, custom permissions, remove
- **Organization management** — CRUD, multi-org switching
- **Credit management** — balance, buy, history
- **Subscription plan management**
- **Historical consumption data** — charts, export
- **Firmware update** — remote OTA
- **Connection alerts** — configure per device (Mobile 2 had no alert config)
- **SSO / 2FA** — security settings
- **Event log** — billing details per 24h
- **Reports** — daily billing per org
- **Dashboard** — org-wide overview, active alerts, recent activity
- **NFC pre-configuration** — transfer Cloud/WiFi/org config before powering device
- **NETIO Cloud connection setup** — broker, API, MQTT status
- **Custom role editor** — granular per-permission toggle
- **Device configuration** — network, MQTT, power-up state
- **Groups/sub-groups** — full CRUD (Mobile 2 had flat grouping only)

---

## Supported devices

PowerPDU: 4PS, 4KS, 4C, 4PV, 4KB, 4PB, 8QV, 8QS, 8KS, 8KF, 8QB, 8KB  
PowerCable: 2KB, 2PZ, 2KZ, 1Kx, 2PB, REST, Modbus, MQTT  
PowerBOX: 3Px, 4Kx  
PowerDIN: 4PZ, ZK3, ZP3  
3-Phase: VK6, FK6  
Legacy: NETIO 4, 4All, 230B, 230C

Metered models (W/A/V/kWh/Hz/PF): 4KS, 4C, 8QS, 8KS, 8KF, 4Kx, 4PZ, PowerCable 2KZ, PowerCable REST/MQTT

---

## NETIO Cloud technical

- **URL:** https://cloud.netio-products.com
- **Device communication:** MQTTs on TCP port 8883 (broker.cloud.netio.eu)
- **Management:** HTTPs on TCP port 443 (titan.netio.eu)
- **API:** Open MQTT API per organization
- **Security:** TLS / SSL for all communication, 2FA, SSO support
- **Servers:** EU (primary + backup)

---

## Design decisions

### Credits in Account menu
Credits are shown as a subtitle on the Organization row in the Account menu for quick visibility (not as a separate row). Full credit management is in Organization → Credits.

### Scheduler location
Scheduler configuration is per-output, in the Output detail screen. It runs locally in the device — not dependent on cloud connection.

### Groups/Sub-groups UX
TBD (open question): flat list vs. tree view for complex hierarchies. Current prototypes show flat list with clickable group headers.

### Android navigation
Material 3 bottom navigation bar (same 4 tabs as iOS). Not using navigation drawer — considered outdated per M3 guidelines.

### Settings scope
Settings = application behavior only (Appearance, Language, Push notifications, Security, About, Logout). User/org management stays in Account tab, not Settings.

### Dashboard
Dashboard is a secondary screen under Account tab (not a primary tab), showing org-wide overview. Energy has its own primary tab for detailed consumption data.

---

## Open questions / TBD

- Groups flat list vs. tree view — which scales better for 100+ devices?
- Energy tab: show per-device or per-output as default?
- Dashboard content: real-time or cached data?
- Subscription plan: which features are locked per plan tier? (A-metering confirmed as premium)
- WatchDog: support for PAB (Power Analyzer Block) configuration?
- PowerUp Sequence: will this be configurable in mobile (currently web-only)?
- NFC: Android NFC configuration flow (same concept, different implementation)

---

## Figma file

https://www.figma.com/file/yIdU3cOfMkARi8CYOHtZud

Iterations page contains:
- Navigation component variants (Tab Bar, Toolbar, Status Bar)
- Menu screens (menu-content, submenu-options)
- Org switcher (bottom sheet)
- Add device sheet
- iPhone 17 frames with placeholder content
