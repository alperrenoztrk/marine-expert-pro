import math
from dataclasses import dataclass
from typing import Tuple

# Note: For stars, GHA_star = (GHA_aries + SHA_star) mod 360.
# Declination is taken from a catalog; here only the combination function is provided.

# Basic astronomical constants
DEG2RAD = math.pi / 180.0
RAD2DEG = 180.0 / math.pi


def _normalize_deg(x: float) -> float:
    return x % 360.0


def _julian_day(year: int, month: int, day: int, hour: int = 0, minute: int = 0, second: float = 0.0) -> float:
    """Julian Day (UTC) using algorithm valid for Gregorian calendar (post-1582)."""
    y = year
    m = month
    d = day + (hour + (minute + second / 60.0) / 60.0) / 24.0
    if m <= 2:
        y -= 1
        m += 12
    A = math.floor(y / 100)
    B = 2 - A + math.floor(A / 5)
    JD = math.floor(365.25 * (y + 4716)) + math.floor(30.6001 * (m + 1)) + d + B - 1524.5
    return JD


def _julian_centuries(JD: float) -> float:
    return (JD - 2451545.0) / 36525.0


def _mean_obliquity_deg(T: float) -> float:
    # IAU 2006-ish simple series (arcseconds)
    seconds = 21.448 - T * (46.8150 + T * (0.00059 - 0.001813 * T))
    eps0 = 23.0 + 26.0 / 60.0 + 21.448 / 3600.0
    return eps0 - seconds / 3600.0


def _apparent_obliquity_deg(T: float, eps0_deg: float) -> float:
    # Nutation in longitude and obliquity (very small) simplified
    # Use the dominant term via Omega
    Omega = 125.04 - 1934.136 * T
    return eps0_deg + 0.00256 * math.cos(Omega * DEG2RAD)


def _sun_geom_mean_long_deg(T: float) -> float:
    L0 = 280.46646 + T * (36000.76983 + 0.0003032 * T)
    return _normalize_deg(L0)


def _sun_geom_mean_anom_deg(T: float) -> float:
    return 357.52911 + T * (35999.05029 - 0.0001537 * T)


def _earth_orbit_eccentricity(T: float) -> float:
    return 0.016708634 - T * (0.000042037 + 0.0000001267 * T)


def _sun_equation_of_center_deg(T: float, M_deg: float) -> float:
    Mrad = M_deg * DEG2RAD
    return (
        math.sin(Mrad) * (1.914602 - T * (0.004817 + 0.000014 * T))
        + math.sin(2 * Mrad) * (0.019993 - 0.000101 * T)
        + math.sin(3 * Mrad) * 0.000289
    )


def _sun_true_longitude_deg(L0_deg: float, C_deg: float) -> float:
    return L0_deg + C_deg


def _sun_apparent_longitude_deg(T: float, true_long_deg: float) -> float:
    Omega = 125.04 - 1934.136 * T
    return true_long_deg - 0.00569 - 0.00478 * math.sin(Omega * DEG2RAD)


def _sun_ra_dec_deg(T: float) -> Tuple[float, float]:
    L0 = _sun_geom_mean_long_deg(T)
    M = _sun_geom_mean_anom_deg(T)
    C = _sun_equation_of_center_deg(T, M)
    true_long = _sun_true_longitude_deg(L0, C)
    lam = _sun_apparent_longitude_deg(T, true_long)
    eps0 = _mean_obliquity_deg(T)
    eps = _apparent_obliquity_deg(T, eps0)
    # Convert to RA/Dec
    lam_r = lam * DEG2RAD
    eps_r = eps * DEG2RAD
    sin_lam = math.sin(lam_r)
    cos_lam = math.cos(lam_r)
    tan_ra_y = math.cos(eps_r) * sin_lam
    tan_ra_x = cos_lam
    ra = math.degrees(math.atan2(tan_ra_y, tan_ra_x)) % 360.0
    dec = math.degrees(math.asin(math.sin(eps_r) * sin_lam))
    return ra, dec


def _gmst_deg(JD: float, T: float) -> float:
    # GMST in degrees (Vallado-formula-like)
    return _normalize_deg(
        280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T - (T ** 3) / 38710000.0
    )


def gha_aries_deg(JD: float, T: float) -> float:
    """Approximate GHA of Aries (≈ GMST) in degrees."""
    return _gmst_deg(JD, T)


def gha_sun_and_dec_deg(year: int, month: int, day: int, hour: int, minute: int, second: float = 0.0) -> Tuple[float, float]:
    """Return (GHA_sun_deg, Dec_sun_deg) for UTC datetime via simplified solar model."""
    JD = _julian_day(year, month, day, hour, minute, second)
    T = _julian_centuries(JD)
    ra_sun, dec_sun = _sun_ra_dec_deg(T)
    gmst = _gmst_deg(JD, T)
    gha_sun = (gmst - ra_sun) % 360.0
    return gha_sun, dec_sun


@dataclass
class AlmanacSun:
    gha_deg: float
    dec_deg: float


def compute_sun_gha_dec_from_iso(iso_utc: str) -> AlmanacSun:
    """Parse ISO 'YYYY-MM-DDTHH:MM[:SS][Z]' and compute Sun GHA/Dec."""
    s = iso_utc.strip().upper().replace("Z", "")
    date_part, time_part = s.split("T")
    y, m, d = [int(x) for x in date_part.split("-")]
    tparts = time_part.split(":")
    if len(tparts) == 2:
        hh, mm = int(tparts[0]), int(tparts[1])
        ss = 0.0
    else:
        hh, mm, ss = int(tparts[0]), int(tparts[1]), float(tparts[2])
    gha, dec = gha_sun_and_dec_deg(y, m, d, hh, mm, ss)
    return AlmanacSun(gha_deg=gha, dec_deg=dec)


@dataclass
class AlmanacAries:
    gha_deg: float


def compute_aries_gha_from_iso(iso_utc: str) -> AlmanacAries:
    s = iso_utc.strip().upper().replace("Z", "")
    date_part, time_part = s.split("T")
    y, m, d = [int(x) for x in date_part.split("-")]
    tparts = time_part.split(":")
    if len(tparts) == 2:
        hh, mm = int(tparts[0]), int(tparts[1])
        ss = 0.0
    else:
        hh, mm, ss = int(tparts[0]), int(tparts[1]), float(tparts[2])
    JD = _julian_day(y, m, d, hh, mm, ss)
    T = _julian_centuries(JD)
    gha = gha_aries_deg(JD, T)
    return AlmanacAries(gha_deg=gha)


def gha_star_from_aries_sha(gha_aries_deg_val: float, sha_star_deg: float) -> float:
    """Compute a star's GHA given Aries GHA and star SHA."""
    return (gha_aries_deg_val + sha_star_deg) % 360.0
