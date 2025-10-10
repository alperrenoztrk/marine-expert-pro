import argparse
from typing import Optional

from .core import (
    lha_from_gha_longitude,
    compute_hc_zn,
    apply_altitude_corrections,
    intercept,
    sun_sd_minutes,
    parallax_alt_minutes_from_hp,
    longitude_from_noon_time,
    equation_of_time_minutes,
    utc_to_lmt_hours,
    lmt_to_utc_hours,
    parse_hms_to_hours,
    deg_to_dms_str,
)
from .almanac import compute_sun_gha_dec_from_iso, compute_aries_gha_from_iso


def format_deg_and_dms(x: float) -> str:
    return f"{x:.5f}°  ({deg_to_dms_str(x)})"


# -------------------- Interactive helpers --------------------

def _read_str(prompt: str, default: Optional[str] = None) -> str:
    p = f"{prompt}{' [' + default + ']' if default is not None else ''}: "
    val = input(p).strip()
    if not val and default is not None:
        return default
    return val


def _read_float(prompt: str, default: Optional[float] = None) -> float:
    while True:
        dflt = f" [{default}]" if default is not None else ""
        val = input(f"{prompt}{dflt}: ").strip()
        if not val and default is not None:
            return float(default)
        try:
            return float(val)
        except ValueError:
            print("Lütfen sayısal bir değer girin.")


# -------------------- Commands --------------------

def cmd_sun(args: argparse.Namespace) -> int:
    lha = lha_from_gha_longitude(args.gha, args.lon)
    hc, zn = compute_hc_zn(args.lat, args.dec, lha)
    parallax_minutes = args.parallax_min
    ho = apply_altitude_corrections(
        hs_deg=args.hs,
        index_error_minutes=args.ie,
        height_of_eye_m=args.height,
        pressure_hpa=args.pressure,
        temperature_c=args.temp,
        semi_diameter_minutes=args.sd_min,
        semi_diameter_is_lower_limb=(args.limb.upper() == "LL"),
        parallax_minutes=parallax_minutes,
    )
    res = intercept(ho, hc)

    print("LHA:", format_deg_and_dms(lha))
    print("Hc:", format_deg_and_dms(hc))
    print("Zn:", format_deg_and_dms(zn))
    print("Ho:", format_deg_and_dms(ho))
    print(f"Intercept: {res.intercept_minutes:.2f}′ {res.direction}")
    return 0


def cmd_star(args: argparse.Namespace) -> int:
    lha = lha_from_gha_longitude(args.gha, args.lon)
    hc, zn = compute_hc_zn(args.lat, args.dec, lha)
    ho = apply_altitude_corrections(
        hs_deg=args.hs,
        index_error_minutes=args.ie,
        height_of_eye_m=args.height,
        pressure_hpa=args.pressure,
        temperature_c=args.temp,
        semi_diameter_minutes=0.0,
        semi_diameter_is_lower_limb=True,
        parallax_minutes=0.0,
    )
    res = intercept(ho, hc)

    print("LHA:", format_deg_and_dms(lha))
    print("Hc:", format_deg_and_dms(hc))
    print("Zn:", format_deg_and_dms(zn))
    print("Ho:", format_deg_and_dms(ho))
    print(f"Intercept: {res.intercept_minutes:.2f}′ {res.direction}")
    return 0


def cmd_moon(args: argparse.Namespace) -> int:
    lha = lha_from_gha_longitude(args.gha, args.lon)
    hc, zn = compute_hc_zn(args.lat, args.dec, lha)
    pa_minutes = parallax_alt_minutes_from_hp(args.hs, args.hp_min)
    ho = apply_altitude_corrections(
        hs_deg=args.hs,
        index_error_minutes=args.ie,
        height_of_eye_m=args.height,
        pressure_hpa=args.pressure,
        temperature_c=args.temp,
        semi_diameter_minutes=args.sd_min,
        semi_diameter_is_lower_limb=(args.limb.upper() == "LL"),
        parallax_minutes=pa_minutes,
    )
    res = intercept(ho, hc)

    print("LHA:", format_deg_and_dms(lha))
    print("Hc:", format_deg_and_dms(hc))
    print("Zn:", format_deg_and_dms(zn))
    print("Ho:", format_deg_and_dms(ho))
    print(f"Intercept: {res.intercept_minutes:.2f}′ {res.direction}")
    return 0


def cmd_noon(args: argparse.Namespace) -> int:
    # Altitude corrections for Sun at meridian
    ho = apply_altitude_corrections(
        hs_deg=args.hs_noon,
        index_error_minutes=args.ie,
        height_of_eye_m=args.height,
        pressure_hpa=args.pressure,
        temperature_c=args.temp,
        semi_diameter_minutes=args.sd_min,
        semi_diameter_is_lower_limb=(args.limb.upper() == "LL"),
        parallax_minutes=args.parallax_min,
    )
    if args.sun_dir.lower() == "south":
        lat = 90.0 - ho + args.dec
    else:
        lat = 90.0 - ho - args.dec

    print("Ho (noon):", format_deg_and_dms(ho))
    print("Latitude:", format_deg_and_dms(lat))

    if args.utc_lan:
        utc_lan_hours = parse_hms_to_hours(args.utc_lan)
        lon = longitude_from_noon_time(utc_lan_hours)
        print("Longitude (East +):", format_deg_and_dms(lon))
    return 0


def cmd_convert(args: argparse.Namespace) -> int:
    if args.mode == "utc-to-lmt":
        utc_hours = parse_hms_to_hours(args.utc)
        lmt_hours = utc_to_lmt_hours(utc_hours, args.lon)
        print(f"LMT: {lmt_hours:0.4f} h")
    elif args.mode == "lmt-to-utc":
        lmt_hours = parse_hms_to_hours(args.lmt)
        utc_hours = lmt_to_utc_hours(lmt_hours, args.lon)
        print(f"UTC: {utc_hours:0.4f} h")
    else:
        raise SystemExit("Unknown mode")
    return 0


def cmd_eot(args: argparse.Namespace) -> int:
    eot = equation_of_time_minutes(args.doy)
    print(f"EoT: {eot:+.2f} minutes")
    return 0


def cmd_almanac_sun(args: argparse.Namespace) -> int:
    sun = compute_sun_gha_dec_from_iso(args.utc)
    print("GHA_sun:", format_deg_and_dms(sun.gha_deg))
    print("Dec_sun:", format_deg_and_dms(sun.dec_deg))
    return 0


def cmd_almanac_aries(args: argparse.Namespace) -> int:
    ar = compute_aries_gha_from_iso(args.utc)
    print("GHA_aries:", format_deg_and_dms(ar.gha_deg))
    return 0


def cmd_srt(args: argparse.Namespace) -> int:
    lat = args.lat
    dec = args.dec
    lon = args.lon
    start = args.lha_start
    stop = args.lha_stop
    step = args.lha_step
    print("LHA,Hc_deg,Zn_deg")
    lha = start
    while True:
        lha_norm = (lha - lon) % 360.0 if args.mode == "from-gha" else lha % 360.0
        hc, zn = compute_hc_zn(lat, dec, lha_norm)
        print(f"{lha_norm:.2f},{hc:.6f},{zn:.6f}")
        lha += step
        if (step > 0 and lha > stop) or (step < 0 and lha < stop):
            break
    return 0


# -------------------- Interactive Commands --------------------

def cmd_almanac_interactive(_: argparse.Namespace) -> int:
    print("Almanak (interaktif)")
    kind = _read_str("Tür (sun/aries)", "sun").strip().lower()
    iso = _read_str("UTC ISO (YYYY-MM-DDTHH:MM[:SS]Z)")
    if kind.startswith("a"):
        ar = compute_aries_gha_from_iso(iso)
        print("Girdi:")
        print(f"  UTC: {iso}")
        print("Çıktı:")
        print("  GHA_aries:", format_deg_and_dms(ar.gha_deg))
    else:
        sun = compute_sun_gha_dec_from_iso(iso)
        print("Girdi:")
        print(f"  UTC: {iso}")
        print("Çıktı:")
        print("  GHA_sun:", format_deg_and_dms(sun.gha_deg))
        print("  Dec_sun:", format_deg_and_dms(sun.dec_deg))
    return 0


def cmd_srt_interactive(_: argparse.Namespace) -> int:
    print("Sight Reduction (interaktif)")
    mode = _read_str("Mod (lha/from-gha)", "lha").strip().lower()
    lat = _read_float("Enlem φ (deg, +Kuzey, −Güney)")
    dec = _read_float("Deklinasyon δ (deg, +Kuzey, −Güney)")

    if mode == "from-gha":
        lon = _read_float("Boylam λ (deg, Doğu +, Batı −)")
        start = _read_float("Başlangıç GHA (deg)")
        stop = _read_float("Bitiş GHA (deg)")
        step = _read_float("Adım (deg)", 5.0)
        gha = start
        while True:
            lha = (gha - lon) % 360.0
            hc, zn = compute_hc_zn(lat, dec, lha)
            print(f"LHA {deg_to_dms_str(lha)} -> Hc {deg_to_dms_str(hc)}, Zn {deg_to_dms_str(zn)}")
            gha += step
            if (step > 0 and gha > stop) or (step < 0 and gha < stop):
                break
    else:
        start = _read_float("Başlangıç LHA (deg)")
        stop = _read_float("Bitiş LHA (deg)")
        step = _read_float("Adım (deg)", 5.0)
        lha = start
        while True:
            lha_n = lha % 360.0
            hc, zn = compute_hc_zn(lat, dec, lha_n)
            print(f"LHA {deg_to_dms_str(lha_n)} -> Hc {deg_to_dms_str(hc)}, Zn {deg_to_dms_str(zn)}")
            lha += step
            if (step > 0 and lha > stop) or (step < 0 and lha < stop):
                break
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="celnav",
        description=(
            "Celestial Navigation CLI: Sun/Star/Moon sights, Noon sight, Almanac, SRT, time conversions, EoT.\n"
            "Angles are decimal degrees (East positive longitude). Times can be decimal hours or HH:MM[:SS]."
        ),
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    # Sun
    psun = sub.add_parser("sun", help="AM/PM Sun sight -> Ho, Hc, Zn, intercept")
    psun.add_argument("--lat", type=float, required=True, help="Assumed latitude (deg, +N, −S)")
    psun.add_argument("--lon", type=float, required=True, help="Assumed longitude (deg, East +, West −)")
    psun.add_argument("--gha", type=float, required=True, help="GHA of Sun (deg)")
    psun.add_argument("--dec", type=float, required=True, help="Declination of Sun (deg, +N, −S)")
    psun.add_argument("--hs", type=float, required=True, help="Observed sextant altitude Hs (deg)")
    psun.add_argument("--ie", type=float, default=0.0, help="Index error minutes (+ off the arc)")
    psun.add_argument("--height", type=float, default=0.0, help="Height of eye (m)")
    psun.add_argument("--pressure", type=float, default=1010.0, help="Pressure (hPa)")
    psun.add_argument("--temp", type=float, default=10.0, help="Temperature (C)")
    psun.add_argument("--limb", type=str, choices=["LL", "UL"], default="LL", help="Limb observed (Sun)")
    psun.add_argument("--sd-min", type=float, default=15.8, help="Sun semi-diameter (minutes)")
    psun.add_argument("--parallax-min", type=float, default=0.1, help="Solar parallax in altitude (minutes)")
    psun.set_defaults(func=cmd_sun)

    # Star
    pstar = sub.add_parser("star", help="Star/planet sight -> Ho, Hc, Zn, intercept")
    pstar.add_argument("--lat", type=float, required=True, help="Assumed latitude (deg, +N, −S)")
    pstar.add_argument("--lon", type=float, required=True, help="Assumed longitude (deg, East +, West −)")
    pstar.add_argument("--gha", type=float, required=True, help="GHA of star (deg) [GHA_aries+SHA]")
    pstar.add_argument("--dec", type=float, required=True, help="Declination of star (deg, +N, −S)")
    pstar.add_argument("--hs", type=float, required=True, help="Observed sextant altitude Hs (deg)")
    pstar.add_argument("--ie", type=float, default=0.0, help="Index error minutes (+ off the arc)")
    pstar.add_argument("--height", type=float, default=0.0, help="Height of eye (m)")
    pstar.add_argument("--pressure", type=float, default=1010.0, help="Pressure (hPa)")
    pstar.add_argument("--temp", type=float, default=10.0, help="Temperature (C)")
    pstar.set_defaults(func=cmd_star)

    # Moon
    pmoon = sub.add_parser("moon", help="Moon sight -> Ho, Hc, Zn, intercept (with HP/SD)")
    pmoon.add_argument("--lat", type=float, required=True, help="Assumed latitude (deg, +N, −S)")
    pmoon.add_argument("--lon", type=float, required=True, help="Assumed longitude (deg, East +, West −)")
    pmoon.add_argument("--gha", type=float, required=True, help="GHA of Moon (deg)")
    pmoon.add_argument("--dec", type=float, required=True, help="Declination of Moon (deg, +N, −S)")
    pmoon.add_argument("--hs", type=float, required=True, help="Observed sextant altitude Hs (deg)")
    pmoon.add_argument("--ie", type=float, default=0.0, help="Index error minutes (+ off the arc)")
    pmoon.add_argument("--height", type=float, default=0.0, help="Height of eye (m)")
    pmoon.add_argument("--pressure", type=float, default=1010.0, help="Pressure (hPa)")
    pmoon.add_argument("--temp", type=float, default=10.0, help="Temperature (C)")
    pmoon.add_argument("--limb", type=str, choices=["LL", "UL"], default="LL", help="Limb observed")
    pmoon.add_argument("--sd-min", type=float, default=15.4, help="Moon semi-diameter (minutes)")
    pmoon.add_argument("--hp-min", type=float, default=57.0, help="Moon horizontal parallax HP (minutes)")
    pmoon.set_defaults(func=cmd_moon)

    # Noon
    pnoon = sub.add_parser("noon", help="Noon sight -> latitude and optional longitude")
    pnoon.add_argument("--hs-noon", type=float, required=True, help="Observed max Hs at LAN (deg)")
    pnoon.add_argument("--ie", type=float, default=0.0, help="Index error minutes (+ off the arc)")
    pnoon.add_argument("--height", type=float, default=0.0, help="Height of eye (m)")
    pnoon.add_argument("--pressure", type=float, default=1010.0, help="Pressure (hPa)")
    pnoon.add_argument("--temp", type=float, default=10.0, help="Temperature (C)")
    pnoon.add_argument("--limb", type=str, choices=["LL", "UL"], default="LL", help="Limb observed (Sun)")
    pnoon.add_argument("--sd-min", type=float, default=15.8, help="Sun semi-diameter (minutes)")
    pnoon.add_argument("--parallax-min", type=float, default=0.1, help="Solar parallax in altitude (minutes)")
    pnoon.add_argument("--dec", type=float, required=True, help="Declination of Sun at LAN (deg)")
    pnoon.add_argument("--sun-dir", type=str, choices=["south", "north"], default="south", help="Sun direction at meridian")
    pnoon.add_argument("--utc-lan", type=str, help="UTC of Local Apparent Noon (HH:MM[:SS] or decimal hours)")
    pnoon.set_defaults(func=cmd_noon)

    # Convert
    pcvt = sub.add_parser("convert", help="Time conversions between UTC and LMT")
    pcvt.add_argument("--mode", choices=["utc-to-lmt", "lmt-to-utc"], required=True)
    pcvt.add_argument("--utc", type=str, help="UTC hours (decimal or HH:MM[:SS])")
    pcvt.add_argument("--lmt", type=str, help="LMT hours (decimal or HH:MM[:SS])")
    pcvt.add_argument("--lon", type=float, required=True, help="Longitude (deg, East +, West −)")
    pcvt.set_defaults(func=cmd_convert)

    # EoT
    peot = sub.add_parser("eot", help="Equation of Time (minutes)")
    peot.add_argument("--doy", type=int, required=True, help="Day of year (1..366)")
    peot.set_defaults(func=cmd_eot)

    # Almanac (Sun)
    pas = sub.add_parser("almanac-sun", help="Compute Sun GHA/Dec from UTC ISO time (YYYY-MM-DDTHH:MM[:SS]Z)")
    pas.add_argument("--utc", required=True, help="UTC ISO time, e.g., 2025-06-21T10:30:00Z")
    pas.set_defaults(func=cmd_almanac_sun)

    # Almanac (Aries)
    paa = sub.add_parser("almanac-aries", help="Compute Aries GHA from UTC ISO time (YYYY-MM-DDTHH:MM[:SS]Z)")
    paa.add_argument("--utc", required=True, help="UTC ISO time, e.g., 2025-06-21T10:30:00Z")
    paa.set_defaults(func=cmd_almanac_aries)

    # SRT (Sight Reduction Table generator)
    psrt = sub.add_parser("srt", help="Generate Hc/Zn across LHA range for given φ, δ (CSV)")
    psrt.add_argument("--mode", choices=["lha", "from-gha"], default="lha", help="Input is LHA directly or derive from GHA-λ")
    psrt.add_argument("--lat", type=float, required=True, help="Latitude (deg)")
    psrt.add_argument("--dec", type=float, required=True, help="Declination (deg)")
    psrt.add_argument("--lon", type=float, default=0.0, help="Longitude (deg, used when mode=from-gha)")
    psrt.add_argument("--lha-start", type=float, required=True, help="Start LHA or GHA (deg)")
    psrt.add_argument("--lha-stop", type=float, required=True, help="Stop LHA or GHA (deg)")
    psrt.add_argument("--lha-step", type=float, default=5.0, help="Step (deg)")
    psrt.set_defaults(func=cmd_srt)

    # Interactive Almanac
    pas_i = sub.add_parser("almanac-i", help="Interactive Almanac: prompt inputs, print narrative output")
    pas_i.set_defaults(func=cmd_almanac_interactive)

    # Interactive SRT
    psrt_i = sub.add_parser("srt-i", help="Interactive SRT: prompt inputs, print line-by-line (no tables)")
    psrt_i.set_defaults(func=cmd_srt_interactive)

    return p


def main(argv: Optional[list] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)
