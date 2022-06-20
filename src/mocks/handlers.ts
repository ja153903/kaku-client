import { rest } from 'msw';

export const handlers = [
  rest.get('https://kaku.be/api/v1/posts', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        posts: [
          {
            id: 12,
            title: 'How to properly use useEffect',
          },
        ],
      })
    );
  }),
  rest.get('https://kaku.be/api/v1/posts/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 12,
        title: 'How to properly use useEffect?',
        createdAt: Date.now(),
        content:
          "# How to properly use useEffect?\n\nApparently there's not good way to use it.",
        category: 'devtalks',
      })
    );
  }),
];
