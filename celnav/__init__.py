"""Celestial navigation utilities and CLI.

Usage:
  python -m celnav --help
"""

from .core import (
    normalize_angle_deg,
    sin_d,
    cos_d,
    tan_d,
    asin_d,
    acos_d,
    atan2_d,
    dms_to_deg,
    deg_to_dms_str,
    lha_from_gha_longitude,
    compute_hc_zn,
    dip_correction_minutes,
    refraction_bennett_minutes,
    sun_sd_minutes,
    parallax_alt_minutes_from_hp,
    apply_altitude_corrections,
    InterceptResult,
    intercept,
    longitude_from_noon_time,
    equation_of_time_minutes,
    utc_to_lmt_hours,
    lmt_to_utc_hours,
    parse_hms_to_hours,
)

__all__ = [
    "normalize_angle_deg",
    "sin_d",
    "cos_d",
    "tan_d",
    "asin_d",
    "acos_d",
    "atan2_d",
    "dms_to_deg",
    "deg_to_dms_str",
    "lha_from_gha_longitude",
    "compute_hc_zn",
    "dip_correction_minutes",
    "refraction_bennett_minutes",
    "sun_sd_minutes",
    "parallax_alt_minutes_from_hp",
    "apply_altitude_corrections",
    "InterceptResult",
    "intercept",
    "longitude_from_noon_time",
    "equation_of_time_minutes",
    "utc_to_lmt_hours",
    "lmt_to_utc_hours",
    "parse_hms_to_hours",
]

__version__ = "0.1.0"
