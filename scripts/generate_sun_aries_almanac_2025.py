"""
Generate an hourly 2025 Nautical Almanac-style table for:
- GHA Aries (deg)
- GHA Sun (deg)
- Sun declination (deg)

Output is written to: src/data/almanac/sun_aries_2025_hourly.json

Notes
-----
- Uses Skyfield with JPL DE421 ephemeris (covers 1900-2050).
- Uses GAST for Aries (apparent sidereal time). If unavailable, falls back to GMST.
- Values are computed for UTC at each whole hour (00..23) for every day of 2025.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import List


@dataclass(frozen=True)
class Almanac2025Header:
    year: int
    start_date: str
    end_date: str
    step: str
    ephemeris: str
    sidereal_time: str
    units: str
    records_per_day: int
    record_fields: List[str]


def main() -> None:
    from skyfield.api import load  # type: ignore

    ts = load.timescale()
    eph = load("de421.bsp")
    earth = eph["earth"]
    sun = eph["sun"]

    start = date(2025, 1, 1)
    end = date(2026, 1, 1)  # exclusive

    records: List[List[float]] = []

    d = start
    while d < end:
        for hour in range(24):
            t = ts.utc(d.year, d.month, d.day, hour, 0, 0)

            # Aries GHA from (apparent) sidereal time at Greenwich
            gast = getattr(t, "gast", None)
            if gast is None:
                # fallback
                sidereal_hours = float(t.gmst)
                sidereal_kind = "GMST"
            else:
                sidereal_hours = float(gast)
                sidereal_kind = "GAST"

            gha_aries_deg = (sidereal_hours * 15.0) % 360.0

            # Sun apparent RA/Dec
            ra, dec, _dist = earth.at(t).observe(sun).apparent().radec()
            ra_deg = (float(ra.hours) * 15.0) % 360.0
            dec_deg = float(dec.degrees)

            # GHA = GHA_aries - RA
            gha_sun_deg = (gha_aries_deg - ra_deg) % 360.0

            # Keep a stable rounding to reduce JSON size while retaining nav precision.
            records.append(
                [
                    round(gha_sun_deg, 6),
                    round(dec_deg, 6),
                    round(gha_aries_deg, 6),
                ]
            )

        d += timedelta(days=1)

    header = Almanac2025Header(
        year=2025,
        start_date=str(start),
        end_date=str(end - timedelta(days=1)),
        step="1h UTC (whole hour)",
        ephemeris="JPL DE421 via Skyfield",
        sidereal_time=sidereal_kind + " @ Greenwich (hours -> deg)",
        units="degrees",
        records_per_day=24,
        record_fields=["ghaSunDeg", "decSunDeg", "ghaAriesDeg"],
    )

    payload = {
        "header": asdict(header),
        # index = dayOfYear(0-based) * 24 + utcHour
        "records": records,
    }

    out_path = Path(__file__).resolve().parents[1] / "src" / "data" / "almanac" / "sun_aries_2025_hourly.json"
    out_path.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
    print(f"Wrote {len(records)} records -> {out_path}")


if __name__ == "__main__":
    main()

