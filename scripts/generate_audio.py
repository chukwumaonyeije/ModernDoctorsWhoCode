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

# Load .env before reading environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

API_KEY = os.getenv('OPENAI_API_KEY')

POSTS_DIR        = Path(__file__).parent.parent / 'src' / 'content' / 'blog' / 'posts'
AUDIO_DIR        = Path(__file__).parent.parent / 'public' / 'audio'
AUDIO_URL_PREFIX = '/audio'

VOICE      = 'onyx'          # best professional male voice
MODEL      = 'tts-1'         # tts-1-hd for higher quality (2x cost)
MAX_CHARS  = 4096             # OpenAI TTS limit per request
DELAY_SEC  = 1               # pause between API calls


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


def tts(text: str, api_key: str) -> bytes:
    """Call OpenAI TTS and return MP3 bytes."""
    from openai import OpenAI
    client = OpenAI(api_key=api_key)
    response = client.audio.speech.create(
        model=MODEL,
        voice=VOICE,
        input=text[:MAX_CHARS],
    )
    return response.content


def process_post(post_path: Path) -> bool:
    """Generate audio for a single post. Returns True if generated."""
    post = frontmatter.load(str(post_path))
    slug = post_path.stem

    if post.metadata.get('audioUrl'):
        print(f'  [skip] {slug} — already has audio')
        return False

    if post.metadata.get('draft', False):
        print(f'  [skip] {slug} — draft')
        return False

    clean = strip_markdown(post.content)
    if not clean:
        print(f'  [skip] {slug} — no content after stripping')
        return False

    title    = post.metadata.get('title', '')
    full_text = f"{title}.\n\n{clean}"[:MAX_CHARS]

    print(f'  [proc] {slug} — {len(full_text):,} chars')

    audio_bytes = tts(full_text, API_KEY)

    audio_path = AUDIO_DIR / f'{slug}.mp3'
    audio_path.write_bytes(audio_bytes)
    print(f'         saved → {audio_path}')

    post.metadata['audioUrl'] = f'{AUDIO_URL_PREFIX}/{slug}.mp3'
    with open(post_path, 'w', encoding='utf-8') as f:
        f.write(frontmatter.dumps(post))
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
