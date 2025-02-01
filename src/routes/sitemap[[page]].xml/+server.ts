// /src/routes/sitemap[[page]].xml/+server.ts
import * as sitemap from 'super-sitemap';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  return await sitemap.response({
    origin: 'https://h2technologiesllc.com',
    page: params.page,
    // maxPerPage: 45_000 // optional; defaults to 50_000
  });
};