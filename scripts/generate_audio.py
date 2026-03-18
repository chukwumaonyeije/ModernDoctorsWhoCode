"""
ElevenLabs Audio Generation Script
===================================
Reads each MDX/MD post, strips markdown, calls ElevenLabs TTS API,
saves MP3 to public/audio/{slug}.mp3, and updates post frontmatter
with audioUrl field.

Setup:
  pip install requests python-frontmatter

Usage:
  python scripts/generate_audio.py

Environment variables (create a .env file in the project root):
  ELEVENLABS_API_KEY=your_key_here
  ELEVENLABS_VOICE_ID=your_voice_id_here
"""

import os
import re
import time
import requests
import frontmatter
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────────
API_KEY  = os.getenv('ELEVENLABS_API_KEY')
VOICE_ID = os.getenv('ELEVENLABS_VOICE_ID')

POSTS_DIR  = Path(__file__).parent.parent / 'src' / 'content' / 'blog' / 'posts'
AUDIO_DIR  = Path(__file__).parent.parent / 'public' / 'audio'
AUDIO_URL_PREFIX = '/audio'

# ElevenLabs limits: 5000 chars per request on Creator, 10000 on Pro+
CHUNK_SIZE   = 4800
DELAY_SEC    = 2      # pause between API calls to respect rate limits
MAX_CHARS    = 15000  # cap per post to control cost (~$0.30/post on Pro)
# ────────────────────────────────────────────────────────────────────────────


def strip_markdown(text: str) -> str:
    """Remove MDX/markdown syntax to get clean prose for TTS."""
    # Remove frontmatter if present
    text = re.sub(r'^---[\s\S]*?---\n', '', text, count=1)
    # Remove import statements
    text = re.sub(r'^import\s+.*$', '', text, flags=re.MULTILINE)
    # Remove JSX/HTML components and tags
    text = re.sub(r'<[^>]+>', '', text)
    # Remove code blocks
    text = re.sub(r'```[\s\S]*?```', '', text)
    # Remove inline code
    text = re.sub(r'`[^`]*`', '', text)
    # Remove images
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    # Remove links but keep text
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    # Remove markdown headings (keep text)
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    # Remove bold/italic
    text = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', text)
    text = re.sub(r'_{1,3}([^_]+)_{1,3}', r'\1', text)
    # Remove blockquotes
    text = re.sub(r'^>\s+', '', text, flags=re.MULTILINE)
    # Remove horizontal rules
    text = re.sub(r'^[-*_]{3,}\s*$', '', text, flags=re.MULTILINE)
    # Remove table syntax
    text = re.sub(r'\|.*\|', '', text)
    # Collapse multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def tts_chunk(text: str, api_key: str, voice_id: str) -> bytes:
    """Call ElevenLabs TTS API and return MP3 bytes."""
    url = f'https://api.elevenlabs.io/v1/text-to-speech/{voice_id}'
    headers = {
        'xi-api-key': api_key,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
    }
    payload = {
        'text': text,
        'model_id': 'eleven_turbo_v2_5',  # fastest + most cost-efficient
        'voice_settings': {
            'stability': 0.5,
            'similarity_boost': 0.75,
        },
    }
    resp = requests.post(url, json=payload, headers=headers, timeout=120)
    resp.raise_for_status()
    return resp.content


def process_post(post_path: Path, dry_run: bool = False) -> bool:
    """
    Generate audio for a single post.
    Returns True if audio was generated, False if skipped.
    """
    post = frontmatter.load(str(post_path))
    slug = post_path.stem

    # Skip if already has audioUrl
    if post.metadata.get('audioUrl'):
        print(f'  [skip] {slug} — already has audio')
        return False

    # Skip drafts
    if post.metadata.get('draft', False):
        print(f'  [skip] {slug} — draft')
        return False

    # Get clean text
    clean = strip_markdown(post.content)
    if not clean:
        print(f'  [skip] {slug} — no content after stripping')
        return False

    # Prepend title for better audio intro
    title = post.metadata.get('title', '')
    full_text = f"{title}.\n\n{clean}"[:MAX_CHARS]

    char_count = len(full_text)
    print(f'  [proc] {slug} — {char_count:,} chars')

    if dry_run:
        print(f'         DRY RUN: would generate audio')
        return False

    # Generate audio (chunk if needed)
    audio_bytes = b''
    chunks = [full_text[i:i+CHUNK_SIZE] for i in range(0, len(full_text), CHUNK_SIZE)]

    for i, chunk in enumerate(chunks):
        print(f'         chunk {i+1}/{len(chunks)}...')
        audio_bytes += tts_chunk(chunk, API_KEY, VOICE_ID)
        if i < len(chunks) - 1:
            time.sleep(DELAY_SEC)

    # Save MP3
    audio_path = AUDIO_DIR / f'{slug}.mp3'
    audio_path.write_bytes(audio_bytes)
    print(f'         saved → {audio_path}')

    # Update frontmatter
    post.metadata['audioUrl'] = f'{AUDIO_URL_PREFIX}/{slug}.mp3'
    with open(post_path, 'w', encoding='utf-8') as f:
        f.write(frontmatter.dumps(post))
    print(f'         frontmatter updated')

    return True


def main():
    if not API_KEY or not VOICE_ID:
        print('ERROR: Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in your .env file')
        print('  Windows: set ELEVENLABS_API_KEY=your_key')
        print('  Or create a .env file and run: pip install python-dotenv')
        return

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    posts = sorted(POSTS_DIR.glob('*.{md,mdx}'))
    # Use explicit glob patterns since Python glob doesn't support alternation
    posts = sorted(list(POSTS_DIR.glob('*.md')) + list(POSTS_DIR.glob('*.mdx')))
    posts = [p for p in posts if not p.name.startswith('_')]

    print(f'Found {len(posts)} posts\n')

    generated = 0
    skipped   = 0
    errors    = []

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
    print(f'Generated: {generated}')
    print(f'Skipped:   {skipped}')
    print(f'Errors:    {len(errors)}')
    if errors:
        print('Failed posts:')
        for e in errors:
            print(f'  - {e}')


if __name__ == '__main__':
    # Load .env if python-dotenv is installed
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass

    main()
