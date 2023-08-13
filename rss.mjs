import { timeouts, rss } from './helpers.mjs';
import parser from 'rss-to-json';

let news;

export function getLatestNews (num) {
  const { items, ...rest } = news;
  rest.items = news.items.slice(0, num > rss.maxitems ? rss.maxitems : num);
  return rest;
}

async function updateNews () {
  news = await parser.parse(rss.feed);
}

setInterval(updateNews, timeouts.rss);
export const isReady = await updateNews();
