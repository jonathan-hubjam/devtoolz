export default function sitemap() {
  const base = 'https://devtoolz.net';

  const routes = [
    '',
    '/json-formatter',
    '/base64-encoder',
    '/jwt-decoder',
    '/unix-timestamp',
    '/url-encoder',
    '/hash-generator',
    '/json-yaml-converter',
    '/regex-tester',
    '/uuid-generator',
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
