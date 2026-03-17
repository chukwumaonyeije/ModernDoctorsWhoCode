import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'fs';
import { resolve } from 'path';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      category: post.data.category ?? 'Technology',
      pubDate: post.data.pubDate,
    },
  }));
}

function getFontSize(title: string): number {
  if (title.length < 40) return 56;
  if (title.length < 70) return 46;
  if (title.length < 100) return 38;
  return 32;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const GET: APIRoute = async ({ props }) => {
  const { title, category, pubDate } = props as {
    title: string;
    category: string;
    pubDate: Date;
  };

  const syneBold = fs.readFileSync(resolve(process.cwd(), 'public/fonts/Syne-Bold.ttf'));
  const dmSans = fs.readFileSync(resolve(process.cwd(), 'public/fonts/DMSans-Regular.ttf'));

  const fontSize = getFontSize(title);
  const formattedDate = formatDate(new Date(pubDate));

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: '#0d1b2a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
        children: [
          // Top gradient accent bar
          {
            type: 'div',
            props: {
              style: {
                width: '100%',
                height: '5px',
                background: 'linear-gradient(to right, #a855f7, #38bdf8)',
                flexShrink: 0,
              },
            },
          },
          // Main content area
          {
            type: 'div',
            props: {
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '52px 80px 56px 80px',
              },
              children: [
                // Top row: site name + category pill
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontFamily: 'Syne',
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#38bdf8',
                            letterSpacing: '0.12em',
                          },
                          children: 'DOCTORS WHO CODE',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontFamily: 'DM Sans',
                            fontSize: '13px',
                            color: '#38bdf8',
                            background: 'rgba(56, 189, 248, 0.08)',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                            borderRadius: '6px',
                            padding: '5px 14px',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          },
                          children: category,
                        },
                      },
                    ],
                  },
                },
                // Title
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'Syne',
                      fontSize: `${fontSize}px`,
                      fontWeight: 700,
                      color: '#f8fafc',
                      lineHeight: 1.25,
                      maxWidth: '1000px',
                    },
                    children: title,
                  },
                },
                // Bottom row: author + date
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #1e293b',
                      paddingTop: '24px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontFamily: 'DM Sans',
                            fontSize: '17px',
                            color: '#94a3b8',
                          },
                          children: 'Chukwuma Onyeije, MD, FACOG',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontFamily: 'DM Sans',
                            fontSize: '15px',
                            color: '#94a3b8',
                          },
                          children: formattedDate,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Syne', data: syneBold, weight: 700, style: 'normal' },
        { name: 'DM Sans', data: dmSans, weight: 400, style: 'normal' },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
