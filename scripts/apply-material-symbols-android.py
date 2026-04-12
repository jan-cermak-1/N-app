#!/usr/bin/env python3
"""Nahradí <svg><use href="#..."/></svg> za Material Symbols Outlined (ligatury) v *-android.html."""
import re
from pathlib import Path

# Mapování symbol id → Material Symbol name (Outlined)
# https://fonts.google.com/icons
GLYPHS = {
    "sf-dashboard": "dashboard",
    "sf-plug": "electrical_services",
    "sf-dev": "devices",
    "sf-search": "search",
    "sf-back": "arrow_back",
    "sf-user": "person",
    "sf-plus": "add",
    "sf-nfc": "nfc",
    "sf-bolt": "bolt",
    "i-plug": "electrical_services",
    "i-dev": "devices",
    "i-bolt": "bolt",
    "i-user": "person",
    "i-bld": "apartment",
    "i-bell": "notifications",
    "i-chart": "bar_chart",
    "i-doc": "description",
    "i-gear": "settings",
    "i-plus": "add",
    "i-back": "arrow_back",
    "i-check": "check",
    "i-search": "search",
    "i-shield": "shield",
    "i-lock": "lock",
    "i-card": "credit_card",
    "i-users": "groups",
    "i-moon": "dark_mode",
    "i-sun": "light_mode",
    "i-cloud": "cloud",
    "i-fw": "swap_horiz",
    "i-folder": "folder",
    "i-timer": "schedule",
    "i-dog": "pets",
    "i-tag": "label",
    "i-ip": "lan",
    "i-wifi": "wifi",
    "i-export": "upload",
    "i-trash": "delete",
    "i-on": "power_settings_new",
    "i-nfc": "nfc",
    "i-restart": "restart_alt",
    "i-cal": "calendar_month",
    "i-logout": "logout",
    "i-globe": "language",
}

ROOT = Path(__file__).resolve().parent.parent


def replace_icons(html: str) -> str:
    # Nejdelší id první (překryvy)
    for sid in sorted(GLYPHS.keys(), key=len, reverse=True):
        glyph = GLYPHS[sid]
        pat = re.compile(
            r"<svg[^>]*>\s*<use href=\"#"
            + re.escape(sid)
            + r"\"/>\s*</svg>",
            re.IGNORECASE,
        )
        html = pat.sub(
            f'<span class="ms ms-24" aria-hidden="true">{glyph}</span>',
            html,
        )
    return html


def main():
    for path in sorted(ROOT.glob("netio-*-android.html")):
        text = path.read_text(encoding="utf-8")
        new = replace_icons(text)
        if new != text:
            path.write_text(new, encoding="utf-8")
            print(f"updated {path.name}")
        else:
            print(f"no change {path.name}")


if __name__ == "__main__":
    main()
