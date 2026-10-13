#!/usr/bin/env python3
"""Make a country outline (SVG path) for a title scene, from Natural Earth data (public domain).

1. Get the data once (npm works in cloud sessions; GitHub raw/Natural Earth sites may not):
       mkdir -p /tmp/geo && cd /tmp/geo && npm pack world-atlas@2.0.2 && tar -xzf world-atlas-2.0.2.tgz
   -> /tmp/geo/package/countries-10m.json
2. Generate a TypeScript module:
       python3 -I scripts/country-outline.py /tmp/geo/package/countries-10m.json "Netherlands" \\
           src/components/netherlands.ts --const NETHERLANDS --min-lon 0 --lat0 52.2 \\
           --point "theHague=4.3007,52.0705" --point "amsterdam=4.9041,52.3676"

The module exports {width, height (=1000), d, <points>} in one coordinate system (viewBox
0 0 width height). Use --min-lon/--max-lon/--min-lat/--max-lat to drop far-away territories
(e.g. Caribbean islands); a part is kept when its centre lies inside the box.

Several countries in one map (e.g. the EU): pass a comma-separated list, and join Natural Earth
pieces that belong to one country with "+" (the first name is used):
       python3 -I scripts/country-outline.py /tmp/geo/package/countries-10m.json \
           "Austria,Belgium,Cyprus+N. Cyprus,Finland+Åland,..." src/components/europe.ts --const EU27
The module then also exports `countries: [{name, d, centre}]`, one path per country.
"""

from __future__ import annotations

import argparse
import json
import math

parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
parser.add_argument("topojson", help="world-atlas countries-10m.json (or -50m)")
parser.add_argument("country", help='Natural Earth name, e.g. "Netherlands", "United Kingdom", "France"')
parser.add_argument("out", help="output .ts file")
parser.add_argument("--const", default="OUTLINE", help="exported constant name")
parser.add_argument("--label", help="name for the file's header comment (default: the country argument)")
parser.add_argument("--min-lon", type=float, default=-180)
parser.add_argument("--max-lon", type=float, default=180)
parser.add_argument("--min-lat", type=float, default=-90)
parser.add_argument("--max-lat", type=float, default=90)
parser.add_argument("--point", action="append", default=[], help='named place "name=lon,lat" (repeatable)')
parser.add_argument("--lat0", type=float, help="projection latitude (default: the country's mean latitude)")
parser.add_argument("--min-area", type=float, default=40, help="drop islands smaller than this (in output units)")
parser.add_argument("--tolerance", type=float, default=0.9, help="simplification tolerance (in output units)")
args = parser.parse_args()

topo = json.load(open(args.topojson))
sx, sy = topo["transform"]["scale"]
tx, ty = topo["transform"]["translate"]


def arc(i: int) -> list[tuple[float, float]]:
    pts, x, y = [], 0, 0
    for dx, dy in topo["arcs"][i if i >= 0 else ~i]:
        x += dx
        y += dy
        pts.append((x * sx + tx, y * sy + ty))
    return pts if i >= 0 else pts[::-1]


def ring(indices: list[int]) -> list[tuple[float, float]]:
    pts: list[tuple[float, float]] = []
    for k, i in enumerate(indices):
        a = arc(i)
        pts.extend(a if k == 0 else a[1:])
    return pts


def outer_rings(name: str) -> list[list[tuple[float, float]]]:
    geom = next(g for g in topo["objects"]["countries"]["geometries"] if g.get("properties", {}).get("name") == name)
    polys = geom["arcs"] if geom["type"] == "MultiPolygon" else [geom["arcs"]]
    return [ring(p[0]) for p in polys]  # outer rings only


def inside(r: list[tuple[float, float]]) -> bool:
    lon = sum(p[0] for p in r) / len(r)
    lat = sum(p[1] for p in r) / len(r)
    return args.min_lon <= lon <= args.max_lon and args.min_lat <= lat <= args.max_lat


# One entry per country: (name, rings). "A+B" joins Natural Earth pieces under the name A.
groups = [g.split("+") for g in args.country.split(",")]
multi = len(groups) > 1
countries = [(g[0], [r for name in g for r in outer_rings(name) if inside(r)]) for g in groups]
rings = [r for _, rs in countries for r in rs]
lat0 = math.radians(args.lat0 if args.lat0 is not None else sum(p[1] for r in rings for p in r) / sum(len(r) for r in rings))


def proj(lon: float, lat: float) -> tuple[float, float]:
    return lon * math.cos(lat0), -lat


xs = [proj(*p)[0] for r in rings for p in r]
ys = [proj(*p)[1] for r in rings for p in r]
minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
k = 1000.0 / (maxy - miny)
width = (maxx - minx) * k


def norm(x: float, y: float) -> tuple[float, float]:
    return (x - minx) * k, (y - miny) * k


prj = [[norm(*proj(*p)) for p in r] for r in rings]


def area(r: list[tuple[float, float]]) -> float:
    return abs(sum(r[i][0] * r[i - 1][1] - r[i - 1][0] * r[i][1] for i in range(len(r)))) / 2


def rdp(pts: list[tuple[float, float]], eps: float) -> list[tuple[float, float]]:
    """Ramer–Douglas–Peucker line simplification."""
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy) or 1e-9
    dmax, idx = 0.0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / length
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]


def simplify_ring(r: list[tuple[float, float]], eps: float) -> list[tuple[float, float]]:
    # A closed ring's first and last points coincide, so split it at the point farthest from the start.
    far = max(range(len(r)), key=lambda i: math.hypot(r[i][0] - r[0][0], r[i][1] - r[0][1]))
    return rdp(r[: far + 1], eps)[:-1] + rdp(r[far:], eps)


def path(rs: list[list[tuple[float, float]]]) -> tuple[str, list[list[tuple[float, float]]]]:
    simple = [simplify_ring(r, args.tolerance) for r in rs if area(r) > args.min_area]
    simple = [r for r in simple if len(r) > 3]
    return " ".join("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in r) + " Z" for r in simple), simple


d, simple = path(prj)

parts = []
for name, rs in countries:
    cd, cs = path([[norm(*proj(*p)) for p in r] for r in rs])
    # Centre of the country's largest part (for labels and staggered animations).
    big = max(cs, key=area)
    cx, cy = sum(x for x, _ in big) / len(big), sum(y for _, y in big) / len(big)
    parts.append(f'    {{ name: "{name}", centre: [{cx:.1f}, {cy:.1f}] as const, d: "{cd}" }},\n')

points = []
for spec in args.point:
    name, coords = spec.split("=")
    lon, lat = map(float, coords.split(","))
    x, y = norm(*proj(lon, lat))
    points.append(f"  {name}: [{x:.1f}, {y:.1f}] as const,\n")

with open(args.out, "w") as f:
    f.write(
        f"// {args.label or args.country} outline from Natural Earth 1:10m Admin 0 countries (public domain, via the\n"
        f"// world-atlas npm package), projected equirectangular and simplified by scripts/country-outline.py.\n"
        f"export const {args.const} = {{\n  width: {width:.1f},\n  height: 1000.0,\n"
        + "".join(points)
        + (f"  countries: [\n{''.join(parts)}  ],\n" if multi else "")
        + f'  d: "{d}",\n}};\n'
    )
print(f"{args.label or args.country}: {len(simple)} parts, {sum(len(r) for r in simple)} points, {width:.0f}x1000 -> {args.out}")
