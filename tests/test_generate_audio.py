import importlib.util
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('generate_audio', Path(__file__).parents[1] / 'scripts/generate_audio.py')
audio = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audio)


class NarrationTests(unittest.TestCase):
    def test_production_notes_are_not_spoken(self):
        source = 'Opening.\n<!-- Speak slowly -->\n{/* voice note */}\n## Hero image prompt\nDraw a doctor.\n## Conclusion\nKeep this.'
        self.assertEqual(audio.strip_markdown(source), 'Opening.\n\nConclusion\nKeep this.')

    def test_failed_regeneration_preserves_previous_recording(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            post = root / 'article.mdx'
            post.write_text('---\ntitle: Article\naudioUrl: /audio/article.mp3\n---\nNarration.', encoding='utf-8')
            recording = root / 'article.mp3'
            recording.write_bytes(b'previous recording')
            with patch.object(audio, 'AUDIO_DIR', root), patch.object(audio, 'tts_chunk', side_effect=RuntimeError('Service unavailable')):
                with self.assertRaises(RuntimeError):
                    audio.process_post(post, force=True)
            self.assertEqual(recording.read_bytes(), b'previous recording')


if __name__ == '__main__':
    unittest.main()
