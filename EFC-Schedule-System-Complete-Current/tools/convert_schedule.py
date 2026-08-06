"""
Electric Flower Co. Schedule Converter

What this script does:
1. Reads schedule.html from the same folder.
2. Finds every <article class="efc-show"> entry.
3. Extracts the date, venue, city/state, and time.
4. Adds a few useful fields for future widgets.
5. Writes the finished data to shows-data.js.

No extra Python packages are required.
"""

from __future__ import annotations

import html
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any


# -------------------------------------------------------------------
# SETTINGS
# -------------------------------------------------------------------

INPUT_FILE = "schedule.html"
OUTPUT_FILE = "shows-data.js"

# Change this only if your schedule uses a different time zone label.
TIME_ZONE = "America/Detroit"


# -------------------------------------------------------------------
# HELPERS
# -------------------------------------------------------------------

MONTHS = {
    "jan": 1,
    "january": 1,
    "feb": 2,
    "february": 2,
    "mar": 3,
    "march": 3,
    "apr": 4,
    "april": 4,
    "may": 5,
    "jun": 6,
    "june": 6,
    "jul": 7,
    "july": 7,
    "aug": 8,
    "august": 8,
    "sep": 9,
    "sept": 9,
    "september": 9,
    "oct": 10,
    "october": 10,
    "nov": 11,
    "november": 11,
    "dec": 12,
    "december": 12,
}


def clean_text(value: str) -> str:
    """Convert HTML entities and tags into readable plain text."""
    value = re.sub(r"<br\s*/?>", " | ", value, flags=re.IGNORECASE)
    value = re.sub(r"<[^>]+>", "", value)
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip(" |")


def extract_class_text(article_html: str, class_name: str) -> str:
    """
    Extract the inner HTML from the first element that contains class_name.
    This is designed specifically for the schedule's simple nested structure.
    """
    pattern = re.compile(
        rf'<(?P<tag>[a-zA-Z0-9]+)\b[^>]*class=["\'][^"\']*\b{re.escape(class_name)}\b[^"\']*["\'][^>]*>'
        rf'(?P<content>.*?)</(?P=tag)>',
        flags=re.IGNORECASE | re.DOTALL,
    )
    match = pattern.search(article_html)
    if not match:
        return ""
    return clean_text(match.group("content"))


def extract_date_parts(article_html: str) -> tuple[str, str, str]:
    month = extract_class_text(article_html, "efc-month")
    day = extract_class_text(article_html, "efc-day")
    year = extract_class_text(article_html, "efc-year")
    return month, day, year


def normalize_date(month_text: str, day_text: str, year_text: str) -> str:
    """Convert AUG / 07 / 2026 into 2026-08-07."""
    month_key = month_text.strip().lower()
    month_number = MONTHS.get(month_key)

    if not month_number:
        raise ValueError(f"Unknown month: {month_text!r}")

    day_number = int(re.sub(r"\D", "", day_text))
    year_number = int(re.sub(r"\D", "", year_text))

    return f"{year_number:04d}-{month_number:02d}-{day_number:02d}"


def split_city_state(location_text: str) -> tuple[str, str]:
    """
    Split a location such as 'Wayland, MI' into city='Wayland', state='MI'.
    If there is no comma, keep the full location as the city.
    """
    location_text = location_text.strip()

    if not location_text:
        return "", ""

    if "," not in location_text:
        return location_text, ""

    city, state = location_text.rsplit(",", 1)
    return city.strip(), state.strip()


def infer_public_status(venue: str) -> bool:
    """
    Mark obviously private events as public=False.
    This is only a starting rule and can be edited later.
    """
    private_words = (
        "private event",
        "private party",
        "private wedding",
        "wedding",
        "birthday party",
        "anniversary party",
        "corporate event",
    )
    lower_venue = venue.lower()
    return not any(word in lower_venue for word in private_words)


def infer_category(venue: str) -> str:
    """
    Create a broad starter category using venue wording.
    These categories can be manually improved later.
    """
    text = venue.lower()

    if "casino" in text:
        return "Casino"
    if "wedding" in text:
        return "Wedding"
    if "private" in text:
        return "Private Event"
    if "concert series" in text or "summer concert" in text:
        return "Concert Series"
    if "festival" in text or "oktoberfest" in text:
        return "Festival"
    if "yacht club" in text or "country club" in text or "dance club" in text:
        return "Club Event"
    if "brew" in text or "brewing" in text:
        return "Brewery"
    if "bar" in text or "saloon" in text or "pub" in text or "tavern" in text:
        return "Bar / Pub"

    return "Live Music"


def make_unique_id(date_text: str, index: int) -> str:
    """
    Create a stable readable ID.
    Multiple shows on the same date receive a numeric suffix.
    """
    return f"show-{date_text}-{index:03d}"


def find_articles(source_html: str) -> list[str]:
    """Return every <article class="efc-show">...</article> block."""
    pattern = re.compile(
        r'<article\b[^>]*class=["\'][^"\']*\befc-show\b[^"\']*["\'][^>]*>'
        r'.*?</article>',
        flags=re.IGNORECASE | re.DOTALL,
    )
    return pattern.findall(source_html)


def build_show(article_html: str, index: int) -> dict[str, Any]:
    month, day, year = extract_date_parts(article_html)
    date_text = normalize_date(month, day, year)

    venue = extract_class_text(article_html, "efc-venue")
    location = extract_class_text(article_html, "efc-city")
    time_text = extract_class_text(article_html, "efc-time")
    city, state = split_city_state(location)

    return {
        "id": make_unique_id(date_text, index),
        "date": date_text,
        "venue": venue,
        "city": city,
        "state": state,
        "time": time_text,
        "category": infer_category(venue),
        "public": infer_public_status(venue),
        "featured": False,
        "ticketLink": "",
        "website": "",
        "image": "",
        "tags": [],
        "notes": "",
    }


def sort_shows(shows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Sort newest dates first, matching the current master schedule style."""
    return sorted(shows, key=lambda show: show["date"], reverse=True)


def validate_shows(shows: list[dict[str, Any]]) -> None:
    """Perform basic checks before writing the JavaScript file."""
    if not shows:
        raise ValueError("No shows were found in schedule.html.")

    required_fields = ("id", "date", "venue", "city", "state", "time")

    for number, show in enumerate(shows, start=1):
        for field in required_fields:
            if field not in show:
                raise ValueError(
                    f"Show #{number} is missing required field {field!r}."
                )

        try:
            datetime.strptime(show["date"], "%Y-%m-%d")
        except ValueError as exc:
            raise ValueError(
                f"Show #{number} has an invalid date: {show['date']!r}"
            ) from exc

        if not show["venue"]:
            raise ValueError(f"Show #{number} has no venue name.")


def write_javascript(shows: list[dict[str, Any]], output_path: Path) -> None:
    """Write the JavaScript database in an easy-to-read format."""
    json_text = json.dumps(
        shows,
        indent=2,
        ensure_ascii=False,
    )

    javascript = f"""/*
Electric Flower Co. Master Show Data

Generated automatically from {INPUT_FILE}.
Total shows: {len(shows)}

Edit individual show records here after conversion.
All website widgets can read from window.EFC_SHOWS.
*/

window.EFC_SHOWS = {json_text};
"""

    output_path.write_text(javascript, encoding="utf-8")


# -------------------------------------------------------------------
# MAIN PROGRAM
# -------------------------------------------------------------------

def main() -> int:
    project_folder = Path(__file__).resolve().parent
    input_path = project_folder / INPUT_FILE
    output_path = project_folder / OUTPUT_FILE

    print("Electric Flower Co. Schedule Converter")
    print("--------------------------------------")
    print(f"Looking for: {input_path}")

    if not input_path.exists():
        print()
        print(f"ERROR: Could not find {INPUT_FILE}.")
        print("Make sure this Python file and schedule.html are in the same folder.")
        return 1

    try:
        source_html = input_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        source_html = input_path.read_text(encoding="utf-8-sig")

    articles = find_articles(source_html)

    if not articles:
        print()
        print("ERROR: No show entries were found.")
        print('The script looks for <article class="efc-show"> blocks.')
        return 1

    shows: list[dict[str, Any]] = []

    for index, article_html in enumerate(articles, start=1):
        try:
            show = build_show(article_html, index)
            shows.append(show)
        except Exception as exc:
            print()
            print(f"ERROR while reading show #{index}: {exc}")
            return 1

    shows = sort_shows(shows)

    try:
        validate_shows(shows)
        write_javascript(shows, output_path)
    except Exception as exc:
        print()
        print(f"ERROR: {exc}")
        return 1

    public_count = sum(1 for show in shows if show["public"])
    private_count = len(shows) - public_count

    print()
    print("Success!")
    print(f"Shows found: {len(shows)}")
    print(f"Public shows: {public_count}")
    print(f"Private shows: {private_count}")
    print(f"Created: {output_path}")
    print()
    print("You can now open shows-data.js in VS Code.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
