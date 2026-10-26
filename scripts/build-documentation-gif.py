"""Encode a real browser frame sequence as a walkthrough GIF and static WebP poster.

Requires Pillow. Input: frames.json [{"file": "frame-00000.png", "duration": 250}]
with PNGs in a sibling frames/ folder. Login screens must never be recorded.
Only visually repeated idle frames are shortened; screen content is not synthesized.
"""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageStat


def build(source, output, start_index=0):
    metadata = json.loads((source / 'frames.json').read_text())[start_index:]
    if not metadata:
        raise ValueError('No recorded frames to encode')
    kept, previous = [], None
    for frame in metadata:
        screenshot = Image.open(source / 'frames' / frame['file']).convert('RGB')
        # Exclude the animated support widget when detecting repeated idle frames.
        fingerprint = screenshot.crop((90, 65, 1410, 900)).resize((660, 418))
        difference = ImageStat.Stat(ImageChops.difference(previous, fingerprint)).mean if previous else [100] * 3
        if kept and sum(difference) / 3 < 0.04:
            kept[-1][1] = min(1500, kept[-1][1] + frame['duration'])
        else:
            kept.append([screenshot.resize((1152, 800), Image.Resampling.LANCZOS), frame['duration']])
            previous = fingerprint
    kept[0][1], kept[-1][1] = 1200, 2500
    samples = Image.new('RGB', (384 * 5, 267 * 8), 'white')
    for index in range(40):
        image = kept[min(len(kept) - 1, int(index * len(kept) / 40))][0].resize((384, 267))
        samples.paste(image, ((index % 5) * 384, (index // 5) * 267))
    palette = samples.quantize(colors=192, method=Image.Quantize.MEDIANCUT)
    encoded = [image.quantize(palette=palette, dither=Image.Dither.NONE) for image, _ in kept]
    output.parent.mkdir(parents=True, exist_ok=True)
    encoded[0].save(output, save_all=True, append_images=encoded[1:], duration=[duration for _, duration in kept], loop=0, optimize=True, disposal=2)
    poster = output.with_name(output.stem + '-poster.webp')
    Image.open(source / 'frames' / metadata[-1]['file']).resize((1152, 800), Image.Resampling.LANCZOS).save(poster, quality=88)
    print(json.dumps({'gif': str(output), 'frames': len(encoded), 'seconds': sum(duration for _, duration in kept) / 1000, 'bytes': output.stat().st_size}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--start-index', type=int, default=0)
    args = parser.parse_args()
    build(args.source, args.output, args.start_index)
