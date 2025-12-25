"""
Combined interactive engine for Marine Expert Pro: tide, UKC and stability calculations.
This script implements a simple tide calculation using the rule of twelfths, computes
under keel clearance (UKC), and performs basic stability calculations using
metacentric height (GM) and new KG after loading.

The script demonstrates how these different calculations can be combined in a unified
engine. Adjust the example values in the `__main__` section as needed.
"""
from dataclasses import dataclass
from typing import List


def calculate_tide(hour: int, tidal_range_m: float, rising: bool = True) -> float:
    """Calculate tidal height change using the rule of twelfths.
    Args:
        hour: hour from the tidal boundary (1..6). Values outside this range are clamped.
        tidal_range_m: total tidal range between high and low water in meters.
        rising: True if the tide is rising, False if falling.
    Returns:
        Tidal height change from the boundary in meters.
    """
    h = max(0, min(6, round(hour)))
    twelfths = [0, 1, 3, 6, 9, 11, 12]
    tw = twelfths[h] / 12.0
    fraction_of_range = tw if rising else 1 - tw
    return fraction_of_range * tidal_range_m


@dataclass
class YukBilgisi:
    """Simple load information class for stability calculations."""
    agirlik: float  # weight in tons
    kg: float       # vertical centre of gravity of load in metres


class EnineStabiliteHesaplama:
    """Simplified transverse stability calculation class."""

    def __init__(self, deplasman: float, km: float, kg: float) -> None:
        self.deplasman = deplasman
        self.km = km
        self.kg = kg
        self.gm = self.km - self.kg

    def yeni_kg_hesapla(self, yukler: List[YukBilgisi]) -> float:
        """Calculate new KG after loading/unloading."""
        toplam_moment = self.deplasman * self.kg
        toplam_agirlik = self.deplasman
        for yuk in yukler:
            toplam_moment += yuk.agirlik * yuk.kg
            toplam_agirlik += yuk.agirlik
        return toplam_moment / toplam_agirlik


def calculate_ukc(chart_depth_m: float, tide_height_m: float, vessel_draft_m: float) -> float:
    """Compute Under Keel Clearance (UKC)."""
    return (chart_depth_m + tide_height_m) - vessel_draft_m


def main() -> None:
    """Run example calculations demonstrating the combined engine."""
    # Example inputs
    high_water = 4.9       # m (chart datum)
    low_water = 0.3        # m (chart datum)
    tidal_range = high_water - low_water

    hour_after_low = 2
    tidal_height_change = calculate_tide(hour_after_low, tidal_range, rising=True)
    predicted_tide_height = low_water + tidal_height_change

    chart_depth = 7.0      # m
    vessel_draft = 8.0     # m
    ukc = calculate_ukc(chart_depth, predicted_tide_height, vessel_draft)

    # Stability calculation
    displacement = 10000   # ton
    km = 8.5               # m
    kg = 6.5               # m
    stability = EnineStabiliteHesaplama(displacement, km, kg)
    loads = [
        YukBilgisi(agirlik=200, kg=12.0),
        YukBilgisi(agirlik=150, kg=2.0),
    ]
    new_kg = stability.yeni_kg_hesapla(loads)
    new_gm = km - new_kg

    print("*** Tidal Calculation ***")
    print(f"Tidal range: {tidal_range:.2f} m")
    print(
        f"Height at {hour_after_low} hours after low water: "
        f"{predicted_tide_height:.2f} m (above chart datum)"
    )
    print("\n*** UKC Calculation ***")
    print(f"Chart depth: {chart_depth:.2f} m, Vessel draft: {vessel_draft:.2f} m")
    print(
        f"Predicted tide height: {predicted_tide_height:.2f} m \u2192 "
        f"UKC = {ukc:.2f} m"
    )
    print("\n*** Stability Calculation ***")
    print(f"Initial GM: {stability.gm:.2f} m")
    print(
        f"New KG after loading: {new_kg:.2f} m \u2192 "
        f"New GM: {new_gm:.2f} m"
    )


if __name__ == "__main__":
    main()
