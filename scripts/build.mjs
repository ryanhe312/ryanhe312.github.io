import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const papers = JSON.parse(await readFile(new URL('data/publications.json', root), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const authorMarkup = name => escape(name).replace(/Ruian He\*?/g, '<strong>$&</strong>');
if (new Set(papers.map(paper => paper.id)).size !== papers.length) throw new Error('Duplicate paper IDs');
for (const paper of papers) {
  if (!['published','preprint'].includes(paper.status)) throw new Error(`Invalid status: ${paper.id}`);
  if (!paper.authors.length || !paper.year || !paper.url.startsWith('https://')) throw new Error(`Incomplete metadata: ${paper.id}`);
}
const renderPaper = paper => {
  const allAuthors = paper.authors.map(authorMarkup).join(', ');
  const longAuthors = paper.authors.length > 9;
  const displayAuthors = longAuthors ? `${paper.authors.slice(0,3).map(authorMarkup).join(', ')}, …, <strong>Ruian He</strong>, …, ${authorMarkup(paper.authors.at(-1))}` : allAuthors;
  const searchText = [paper.title, ...paper.authors, paper.venue, paper.summary, ...(paper.aliases || [])].join(' ');
  return `<article class="paper" id="paper-${escape(paper.id)}" data-year="${paper.year}" data-status="${paper.status}" data-search="${escape(searchText)}">
  <span class="paper-year">${paper.year}</span><div class="paper-body"><h4><a href="${escape(paper.url)}">${escape(paper.title)} <span aria-hidden="true">↗</span></a></h4><p class="authors">${displayAuthors}</p>${longAuthors ? `<details class="author-details"><summary>All authors</summary><p>${allAuthors}</p></details>` : ''}<p class="paper-summary">${escape(paper.summary)}</p></div><div class="paper-meta"><span>${escape(paper.venue)}</span>${paper.status === 'preprint' ? '<span class="preprint-label">Preprint</span>' : ''}${paper.code ? `<a href="${escape(paper.code)}">Code ↗</a>` : ''}</div>
</article>`;
};
let html = await readFile(new URL('index.template.html', root), 'utf8');
for (const [marker, replacement] of Object.entries({
  '{{PAPER_COUNT}}': String(papers.length),
  '{{PUBLISHED_COUNT}}': String(papers.filter(p => p.status === 'published').length),
  '{{PREPRINT_COUNT}}': String(papers.filter(p => p.status === 'preprint').length),
  '{{YEAR_OPTIONS}}': [...new Set(papers.map(p => p.year))].sort((a,b) => b-a).map(y => `<option value="${y}">${y}</option>`).join(''),
  '{{PUBLISHED}}': papers.filter(p => p.status === 'published').map(renderPaper).join('\n'),
  '{{PREPRINTS}}': papers.filter(p => p.status === 'preprint').map(renderPaper).join('\n')
})) html = html.replace(marker, replacement);
if (/\{\{\w+\}\}/.test(html)) throw new Error('Unresolved template marker');
await writeFile(new URL('index.html', root), html);
const bibEscape = value => String(value).replaceAll('&', '\\&').replaceAll('%', '\\%').replaceAll('_', '\\_');
const bib = papers.map(paper => {
  const conference = ['ACM Multimedia', 'AAAI', 'NeurIPS', 'CVPR Workshops', 'ICASSP'].includes(paper.venue);
  const firstAuthor = paper.authors[0].replace('*','').trim().split(' ').at(-1).replace(/[^a-zA-Z]/g,'');
  const authors = paper.authors.map(a => a === 'AIMAE Team' ? '{AIMAE Team}' : a.replaceAll('*','')).join(' and ');
  return `@${paper.status === 'preprint' ? 'misc' : conference ? 'inproceedings' : 'article'}{${firstAuthor}${paper.year}${paper.id.replaceAll('-','')},\n  title = {{${bibEscape(paper.title)}}},\n  author = {${authors}},\n  year = {${paper.year}},\n  ${paper.status === 'preprint' ? 'howpublished' : conference ? 'booktitle' : 'journal'} = {${bibEscape(paper.venue)}},\n  url = {${paper.url}}${paper.status === 'preprint' ? ',\n  note = {Preprint}' : ''}\n}`;
}).join('\n\n');
await writeFile(new URL('data/publications.bib', root), bib + '\n');
console.log(`Built ${fileURLToPath(new URL('index.html',root))} with ${papers.length} papers.`);
