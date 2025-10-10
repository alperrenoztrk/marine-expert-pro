import math
from dataclasses import dataclass
from typing import Tuple, Literal

# -------------- Angle helpers (degrees) --------------

def normalize_angle_deg(angle_deg: float) -> float:
    """Normalize any angle to [0, 360)."""
    return angle_deg % 360.0


def sin_d(deg: float) -> float:
    return math.sin(math.radians(deg))


def cos_d(deg: float) -> float:
    return math.cos(math.radians(deg))


def tan_d(deg: float) -> float:
    return math.tan(math.radians(deg))


def asin_d(x: float) -> float:
    return math.degrees(math.asin(max(-1.0, min(1.0, x))))


def acos_d(x: float) -> float:
    return math.degrees(math.acos(max(-1.0, min(1.0, x))))


def atan2_d(y: float, x: float) -> float:
    return math.degrees(math.atan2(y, x))


def dms_to_deg(deg: int, minutes: float, sign: int = 1) -> float:
    """Convert D° M′ to signed decimal degrees (sign=+1 north/east, -1 south/west)."""
    return sign * (abs(deg) + minutes / 60.0)


def deg_to_dms_str(angle_deg: float) -> str:
    """Format decimal degrees as D° M.m′ (no N/S/E/W suffix)."""
    a = abs(angle_deg)
    d = int(a)
    m = (a - d) * 60.0
    return f"{d}° {m:05.2f}′"


# -------------- Core celestial computations --------------

def lha_from_gha_longitude(gha_deg: float, longitude_deg_east_positive: float) -> float:
    """Compute Local Hour Angle (degrees, 0–360) with East-positive longitude: LHA = GHA − λ."""
    return normalize_angle_deg(gha_deg - longitude_deg_east_positive)


def compute_hc_zn(lat_deg: float, dec_deg: float, lha_deg: float) -> Tuple[float, float]:
    """Calculated altitude (Hc) and azimuth (Zn, from North, clockwise)."""
    sin_hc = sin_d(lat_deg) * sin_d(dec_deg) + cos_d(lat_deg) * cos_d(dec_deg) * cos_d(lha_deg)
    hc = asin_d(sin_hc)
    x = sin_d(lha_deg)
    y = (cos_d(lat_deg) * tan_d(dec_deg)) - (sin_d(lat_deg) * cos_d(lha_deg))
    zn = normalize_angle_deg(atan2_d(x, y))
    return hc, zn


# -------------- Observational corrections (minutes of arc) --------------

def dip_correction_minutes(height_of_eye_m: float) -> float:
    """Dip correction (minutes). Negative value to subtract from Hs."""
    if height_of_eye_m <= 0:
        return 0.0
    return -1.76 * math.sqrt(height_of_eye_m)


def refraction_bennett_minutes(alt_deg: float, pressure_hpa: float = 1010.0, temperature_c: float = 10.0) -> float:
    """Approximate astronomical refraction in minutes (negative)."""
    alt = max(0.1, alt_deg)
    k = 0.97015 * (pressure_hpa / (273.15 + temperature_c))
    denom = math.tan(math.radians(alt + (10.3 / (alt + 5.11))))
    return -k / denom


def sun_sd_minutes(approx: float = 15.8) -> float:
    return approx


def parallax_alt_minutes_from_hp(alt_deg: float, hp_minutes: float) -> float:
    """Parallax in altitude (minutes), roughly HP * cos(alt)."""
    return hp_minutes * cos_d(alt_deg)


def apply_altitude_corrections(
    hs_deg: float,
    index_error_minutes: float = 0.0,
    height_of_eye_m: float = 0.0,
    pressure_hpa: float = 1010.0,
    temperature_c: float = 10.0,
    semi_diameter_minutes: float = 0.0,
    semi_diameter_is_lower_limb: bool = True,
    parallax_minutes: float = 0.0,
) -> float:
    """
    Apply corrections to sextant altitude Hs to obtain Ho (apparent altitude).
    Index correction (IC) = -IE; here pass IE (minutes, + off the arc), function uses IC = -IE -> add (−IE)
    Dip: subtract
    Refraction: subtract (negative)
    Semi-diameter: add for LL, subtract for UL
    Parallax: subtract
    """
    ic_minutes = -index_error_minutes
    dip_minutes = dip_correction_minutes(height_of_eye_m)
    ref_minutes = refraction_bennett_minutes(hs_deg, pressure_hpa, temperature_c)
    sd_minutes = semi_diameter_minutes if semi_diameter_is_lower_limb else -semi_diameter_minutes
    total_minutes = ic_minutes + dip_minutes + ref_minutes + sd_minutes - parallax_minutes
    return hs_deg + (total_minutes / 60.0)


# -------------- Intercept --------------

@dataclass
class InterceptResult:
    intercept_minutes: float
    direction: Literal["toward", "away"]


def intercept(Ho_deg: float, Hc_deg: float) -> InterceptResult:
    diff_minutes = (Ho_deg - Hc_deg) * 60.0
    return InterceptResult(intercept_minutes=abs(diff_minutes), direction=("toward" if diff_minutes >= 0 else "away"))


# -------------- Noon / time --------------

def longitude_from_noon_time(utc_lan_hours: float) -> float:
    """Longitude (degrees, East positive) from Local Apparent Noon UTC: λ = (12h − UTC_LAN)*15°"""
    return (12.0 - utc_lan_hours) * 15.0


def equation_of_time_minutes(day_of_year: int) -> float:
    B = 2.0 * math.pi * (day_of_year - 81) / 364.0
    return 9.87 * math.sin(2 * B) - 7.53 * math.cos(B) - 1.5 * math.sin(B)


def utc_to_lmt_hours(utc_hours: float, longitude_deg_east_positive: float) -> float:
    return (utc_hours + longitude_deg_east_positive / 15.0) % 24.0


def lmt_to_utc_hours(lmt_hours: float, longitude_deg_east_positive: float) -> float:
    return (lmt_hours - longitude_deg_east_positive / 15.0) % 24.0


def parse_hms_to_hours(text: str) -> float:
    """Parse 'HH:MM[:SS]' or decimal hours string to float hours."""
    s = text.strip()
    if ":" not in s:
        return float(s)
    parts = s.split(":")
    if len(parts) == 2:
        h, m = parts
        sec = 0.0
    elif len(parts) == 3:
        h, m, sec = parts
    else:
        raise ValueError("Time must be HH:MM or HH:MM:SS or decimal hours")
    hours = float(h)
    minutes = float(m)
    seconds = float(sec)
    sign = -1.0 if hours < 0 else 1.0
    return sign * (abs(hours) + minutes / 60.0 + seconds / 3600.0)
