#!/usr/bin/env python3
"""Kit SFX premium GEX (sintetizado, sin licencias, determinista).
Uso: python3 tools/sfx_premium.py <carpeta_salida>
Suave: sin ondas cuadradas/sierra, ataques redondeados, filtros, reverb estéreo."""
import sys, os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR * d)) / SR
def lp(x, f, o=4): return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], "band", fs=SR, output="sos"), x)
def fade(x, i=0.002, o=0.02):
    n, m = int(SR * i), int(SR * o)
    if n: x[:n] *= np.linspace(0, 1, n) ** 2
    if m: x[-m:] *= np.linspace(1, 0, m) ** 2
    return x
def pink(n):
    w = rng.standard_normal(n)
    X = np.fft.rfft(w); f = np.fft.rfftfreq(n, 1 / SR); f[0] = 1
    return np.fft.irfft(X / np.sqrt(f), n)

def reverb(st, decay=0.9, wet=0.2, pre=0.012, tone=6000):
    n = int(SR * decay * 1.6)
    env = np.exp(-6.9 * np.arange(n) / (SR * decay))
    ir = [lp(rng.standard_normal(n) * env, tone, 2) for _ in range(2)]
    ir = [np.concatenate([np.zeros(int(SR * pre)), i]) for i in ir]
    ir = [i / np.sqrt(np.sum(i ** 2)) for i in ir]
    out = []
    for c in range(2):
        w = fftconvolve(st[c], ir[c])[: len(st[c]) + len(ir[c])]
        d = np.concatenate([st[c], np.zeros(len(w) - len(st[c]))])
        out.append(d * (1 - wet) + w * wet)
    return np.array(out)

def stereo(x, pan=0.0):  # pan -1..1 (o array)
    p = (np.asarray(pan) + 1) * np.pi / 4
    return np.array([x * np.cos(p), x * np.sin(p)])

def save(path, st, peak_db=-3.0):
    st = st / (np.max(np.abs(st)) + 1e-9) * 10 ** (peak_db / 20)
    for c in range(2): st[c] = fade(st[c], 0.001, 0.03)
    # recorta cola silenciosa
    a = np.max(np.abs(st), axis=0); idx = np.where(a > 10 ** (-60 / 20))[0]
    st = st[:, : idx[-1] + 1] if len(idx) else st
    wavfile.write(path, SR, (st.T * 32767).astype(np.int16))

def bell(f0, d, ratios, amps, decays, att=0.003):
    x = t(d); y = np.zeros_like(x)
    for r, a, k in zip(ratios, amps, decays):
        y += a * np.sin(2 * np.pi * f0 * r * x) * np.exp(-x / k)
    y *= np.minimum(1, x / att)
    return y

def whoosh(d=0.55, f_lo=250, f_hi=2600, rev=False):
    n = int(SR * d); x = t(d); u = x / d
    if rev: u = 1 - u
    env = np.sin(np.pi * np.clip(u, 0, 1) ** 0.75) ** 2.2
    src = pink(n)
    # banco de bandas: la energía barre de grave a agudo y vuelve
    centers = np.geomspace(f_lo, f_hi, 7)
    pos = np.sin(np.pi * u) * (len(centers) - 1)
    y = np.zeros(n)
    for i, c in enumerate(centers):
        w = np.exp(-0.5 * ((pos - i) / 0.9) ** 2)
        y += bp(src, c / 1.5, min(c * 1.5, SR / 2 - 100)) * w
    y = lp(y * env, 7000)
    st = stereo(y, np.linspace(-0.6, 0.6, n) * (-1 if rev else 1))
    return reverb(st, 0.7, 0.22)

def main(out):
    os.makedirs(out, exist_ok=True)
    # whoosh suave (entrada) y salida (inverso, más corto)
    save(f"{out}/whoosh.wav", whoosh(0.55), -4)
    save(f"{out}/whoosh-out.wav", whoosh(0.42, 280, 2400, rev=True), -4)
    # pop tipo burbuja: seno con glissando, cuerpo redondo
    x = t(0.14); f = 260 + 640 * (1 - np.exp(-x / 0.02))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x / 0.035) * np.minimum(1, x / 0.002)
    y += 0.25 * np.sin(4 * np.pi * np.cumsum(f) / SR) * np.exp(-x / 0.02)
    save(f"{out}/pop.wav", reverb(stereo(lp(y, 3500)), 0.35, 0.15), -5)
    # click de UI: tap corto y apagado (no metálico)
    x = t(0.05)
    y = np.sin(2 * np.pi * 1450 * x) * np.exp(-x / 0.006) + 0.5 * bp(rng.standard_normal(len(x)), 1500, 5000) * np.exp(-x / 0.0025)
    save(f"{out}/click.wav", reverb(stereo(lp(y, 6000)), 0.25, 0.1), -6)
    # tick de madera (marimba aguda corta)
    y = bell(1050, 0.18, [1, 3.93, 9.2], [1, 0.25, 0.06], [0.05, 0.012, 0.004])
    save(f"{out}/tick.wav", reverb(stereo(lp(y, 5000)), 0.3, 0.12), -7)
    # ding: campana de vidrio (dos notas en quinta) con cola
    y = bell(1318.5, 1.6, [1, 2.0, 3.01, 4.17], [1, 0.35, 0.12, 0.05], [0.55, 0.3, 0.15, 0.08])
    y += 0.55 * bell(1975.5, 1.6, [1, 2.0, 3.0], [1, 0.25, 0.08], [0.45, 0.22, 0.1])
    save(f"{out}/ding.wav", reverb(np.array([y, np.roll(y, 40)]), 1.2, 0.28), -5)
    # éxito: arpegio ascendente tipo marimba (Do-Mi-Sol-Do)
    n = int(SR * 1.4); y = np.zeros(n)
    for i, f0 in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
        s = int(SR * 0.075 * i)
        b = bell(f0, 1.4, [1, 3.93, 2.0], [1, 0.12, 0.2], [0.35, 0.03, 0.15])
        y[s:] += b[: n - s] * (0.9 - 0.1 * i)
    save(f"{out}/success.wav", reverb(stereo(lp(y, 7000), 0.0), 1.0, 0.25), -5)
    # golpe suave: sub + cuerpo + aire (sellos, números grandes)
    x = t(0.6); f = 48 + 70 * np.exp(-x / 0.03)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x / 0.18)
    body = lp(rng.standard_normal(len(x)), 900) * np.exp(-x / 0.03) * 0.6
    air = hp(rng.standard_normal(len(x)), 5000) * np.exp(-x / 0.05) * 0.08
    y = (sub + body + air) * np.minimum(1, x / 0.002)
    save(f"{out}/impact.wav", reverb(stereo(y), 0.8, 0.18, tone=3000), -3)
    # brillo/shimmer: campanitas agudas aleatorias (destellos, chispas)
    n = int(SR * 0.9); y = np.zeros(n)
    for i in range(7):
        s = int(SR * 0.05 * i); f0 = 2600 + 400 * rng.random()
        b = bell(f0, 0.9, [1, 2.0], [1, 0.2], [0.18, 0.08]) * (1 - i * 0.1)
        y[s:] += b[: n - s]
    save(f"{out}/shimmer.wav", reverb(stereo(y, 0.0), 1.0, 0.35), -8)

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "sfx-premium")
