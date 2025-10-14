from dataclasses import dataclass
from typing import Dict, Optional, List


@dataclass(frozen=True)
class StarEntry:
    name: str
    sha_deg: float  # Sidereal Hour Angle (degrees)
    dec_deg: float  # Declination (degrees, North positive)


# Minimal navigation star catalog (approximate SHA/Dec values)
_STAR_CATALOG: Dict[str, StarEntry] = {}


def _add(name: str, sha: float, dec: float) -> None:
    entry = StarEntry(name=name, sha_deg=sha, dec_deg=dec)
    _STAR_CATALOG[name.lower()] = entry


# Data sourced from commonly used navigation star lists (approximate)
_add("Sirius", 259.0, -16.7)
_add("Canopus", 264.0, -52.7)
_add("Arcturus", 146.0, 19.2)
_add("Vega", 81.0, 38.8)
_add("Capella", 281.0, 46.0)
_add("Rigel", 282.0, -8.2)
_add("Procyon", 245.0, 5.2)
_add("Betelgeuse", 271.0, 7.4)
_add("Aldebaran", 291.0, 16.5)
_add("Spica", 159.0, -11.2)
_add("Antares", 113.0, -26.4)
_add("Pollux", 244.0, 28.0)
_add("Fomalhaut", 16.0, -29.6)
_add("Deneb", 49.0, 45.3)
_add("Regulus", 208.0, 12.0)


def get_star(name: str) -> Optional[StarEntry]:
    return _STAR_CATALOG.get(name.strip().lower())


def list_stars() -> List[StarEntry]:
    return list(_STAR_CATALOG.values())
