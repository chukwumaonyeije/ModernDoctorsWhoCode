"""
OpenAI TTS Audio Generation Script
====================================
Reads each MDX/MD post, strips markdown, calls OpenAI TTS API,
saves MP3 to public/audio/{slug}.mp3, and updates post frontmatter
with audioUrl field.

Setup:
  pip install openai python-frontmatter python-dotenv

Usage:
  python scripts/generate_audio.py          # all posts
  python scripts/generate_audio.py --test   # one post only

Environment variables (.env in project root):
  OPENAI_API_KEY=sk-...
"""

import os
import re
import time
import frontmatter
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

API_KEY = os.getenv('OPENAI_API_KEY')

POSTS_DIR        = Path(__file__).parent.parent / 'src' / 'content' / 'blog' / 'posts'
AUDIO_DIR        = Path(__file__).parent.parent / 'public' / 'audio'
AUDIO_URL_PREFIX = '/audio'

VOICE      = 'onyx'    # deep, professional male voice
MODEL      = 'tts-1'   # tts-1-hd for higher quality (2x cost)
CHUNK_SIZE = 4096      # OpenAI TTS limit per request
DELAY_SEC  = 1         # pause between API calls


def strip_markdown(text: str) -> str:
    """Remove MDX/markdown syntax to get clean prose for TTS."""
    text = re.sub(r'^---[\s\S]*?---\n', '', text, count=1)
    text = re.sub(r'^import\s+.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'```[\s\S]*?```', '', text)
    text = re.sub(r'`[^`]*`', '', text)
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', text)
    text = re.sub(r'_{1,3}([^_]+)_{1,3}', r'\1', text)
    text = re.sub(r'^>\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^[-*_]{3,}\s*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'\|.*\|', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def chunk_text(text: str, size: int) -> list[str]:
    """Split text into chunks at sentence boundaries."""
    if len(text) <= size:
        return [text]
    chunks = []
    while text:
        if len(text) <= size:
            chunks.append(text)
            break
        split_at = text.rfind('. ', 0, size)
        if split_at == -1:
            split_at = size
        else:
            split_at += 1
        chunks.append(text[:split_at].strip())
        text = text[split_at:].strip()
    return chunks


def tts_chunk(text: str) -> bytes:
    """Call OpenAI TTS for a single chunk. Returns MP3 bytes."""
    from openai import OpenAI
    client = OpenAI(api_key=API_KEY)
    response = client.audio.speech.create(
        model=MODEL,
        voice=VOICE,
        input=text,
    )
    return response.content


def write_audio_url(post_path: Path, slug: str) -> None:
    """Add audioUrl to frontmatter using direct text manipulation — no PyYAML encoding issues."""
    text = post_path.read_text(encoding='utf-8')
    audio_line = f'audioUrl: {AUDIO_URL_PREFIX}/{slug}.mp3\n'
    # Insert after the opening --- line only if not already present
    if 'audioUrl:' not in text:
        text = text.replace('---\n', f'---\n{audio_line}', 1)
        post_path.write_text(text, encoding='utf-8')


def process_post(post_path: Path) -> bool:
    """Generate audio for a single post. Returns True if processed."""
    with open(post_path, encoding='utf-8') as f:
        post = frontmatter.load(f)
    slug = post_path.stem
    audio_path = AUDIO_DIR / f'{slug}.mp3'

    if post.metadata.get('audioUrl'):
        print(f'  [skip] {slug} — already has audio')
        return False

    if post.metadata.get('draft', False):
        print(f'  [skip] {slug} — draft')
        return False

    # MP3 already on disk (e.g. from a previous interrupted run) — just update frontmatter
    if audio_path.exists():
        print(f'  [fix]  {slug} — MP3 exists, updating frontmatter only')
        write_audio_url(post_path, slug)
        print(f'         frontmatter updated')
        return True

    clean = strip_markdown(post.content)
    if not clean:
        print(f'  [skip] {slug} — no content after stripping')
        return False

    title     = post.metadata.get('title', '')
    full_text = f"{title}.\n\n{clean}"
    chunks    = chunk_text(full_text, CHUNK_SIZE)

    print(f'  [proc] {slug} — {len(full_text):,} chars, {len(chunks)} chunk(s)')

    audio_bytes = b''
    for i, chunk in enumerate(chunks):
        if len(chunks) > 1:
            print(f'         chunk {i + 1}/{len(chunks)}...')
        audio_bytes += tts_chunk(chunk)
        if i < len(chunks) - 1:
            time.sleep(DELAY_SEC)

    audio_path.write_bytes(audio_bytes)
    print(f'         saved → {audio_path} ({len(audio_bytes):,} bytes)')

    write_audio_url(post_path, slug)
    print(f'         frontmatter updated')

    return True


def main():
    if not API_KEY:
        print('ERROR: Set OPENAI_API_KEY in your .env file')
        return

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    posts = sorted(list(POSTS_DIR.glob('*.md')) + list(POSTS_DIR.glob('*.mdx')))
    posts = [p for p in posts if not p.name.startswith('_')]

    print(f'Found {len(posts)} posts\n')

    generated, skipped, errors = 0, 0, []

    for post_path in posts:
        try:
            result = process_post(post_path)
            if result:
                generated += 1
                time.sleep(DELAY_SEC)
            else:
                skipped += 1
        except Exception as e:
            print(f'  [ERROR] {post_path.name}: {e}')
            errors.append(post_path.name)

    print(f'\n── Summary ──────────────────────────────')
    print(f'Generated : {generated}')
    print(f'Skipped   : {skipped}')
    print(f'Errors    : {len(errors)}')
    if errors:
        for e in errors:
            print(f'  - {e}')


if __name__ == '__main__':
    import sys

    if '--test' in sys.argv:
        if not API_KEY:
            print('ERROR: Set OPENAI_API_KEY in .env')
        else:
            AUDIO_DIR.mkdir(parents=True, exist_ok=True)
            posts = sorted(list(POSTS_DIR.glob('*.md')) + list(POSTS_DIR.glob('*.mdx')))
            posts = [p for p in posts if not p.name.startswith('_')]
            for post_path in posts:
                post = frontmatter.load(str(post_path))
                if not post.metadata.get('audioUrl') and not post.metadata.get('draft', False):
                    print(f'Test run on: {post_path.name}')
                    process_post(post_path)
                    print('\nTest complete. Check public/audio/ for the MP3.')
                    break
    else:
        main()
