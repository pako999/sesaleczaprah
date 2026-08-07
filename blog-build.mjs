import fs from 'node:fs';
import path from 'node:path';

export function buildBlog({root,out,base,abs,esc,write}){
  const postsDir=path.join(root,'blog-posts');
  const posts=fs.readdirSync(postsDir).filter(f=>f.endsWith('.json')).sort().map(f=>JSON.parse(fs.readFileSync(path.join(postsDir,f),'utf8')));

  const blogHead=(title,description,url,type='article')=>`<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${abs(url)}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/blog.css"><meta property="og:type" content="${type}"><meta property="og:locale" content="sl_SI"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${abs(url)}"><meta property="og:image" content="https://raw.githubusercontent.com/pako999/sesaleczaprah/main/assets/wall.webp"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="https://raw.githubusercontent.com/pako999/sesaleczaprah/main/assets/wall.webp">`;

  const blogIndex=()=>{
    const cards=posts.map(p=>`<article class="blog-card"><a href="/blog/${p.slug}/"><img src="/assets/wall.webp" alt="${esc(p.title)}" loading="lazy"><div><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><span>Preberi vodič →</span></div></a></article>`).join('');
    const ld={'@context':'https://schema.org','@type':'Blog',name:'Vrtanje brez prahu: vodiči in nasveti',url:abs('/blog/'),inLanguage:'sl'};
    return `<!doctype html><html lang="sl"><head>${blogHead('Vrtanje brez prahu: vodiči in nasveti','Praktični vodiči za čistejše vrtanje v steno, strop, beton, opeko in mavčne plošče.','/blog/','website')}<script type="application/ld+json">${JSON.stringify(ld)}</script></head><body><header class="blog-top"><a class="blog-brand" href="/">● BREZ PRAHU</a><nav><a href="/">Izdelek</a></nav></header><main class="blog-shell"><p class="crumb"><a href="/">Izdelek</a> / Nasveti</p><header class="blog-hero"><p class="eyebrow">VODIČI</p><h1>Vrtanje brez prahu: vodiči in nasveti</h1><p>Praktični vodiči za čistejše vrtanje v steno, strop, beton, opeko in mavčne plošče.</p></header><div class="blog-grid">${cards}</div><section class="blog-cta"><h2>Želiš vrtati z manj prahu?</h2><p>Zbiralnik priklopiš na sesalno cev, prisloniš na površino in začneš vrtati. Akcijska cena je 14,90 €.</p><a class="btn btn-primary" href="/#order">Naroči zbiralnik</a></section></main></body></html>`;
  };

  const articlePage=p=>{
    const url=`/blog/${p.slug}/`;
    const sections=p.sections.map(([h,t])=>`<section><h2>${esc(h)}</h2><p>${esc(t)}</p></section>`).join('');
    const faq=p.faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
    const related=posts.filter(x=>x.slug!==p.slug).slice(0,3).map(x=>`<a href="/blog/${x.slug}/">${esc(x.title)} →</a>`).join('');
    const ld={'@context':'https://schema.org','@graph':[{'@type':'BlogPosting',headline:p.title,description:p.description,image:'https://raw.githubusercontent.com/pako999/sesaleczaprah/main/assets/wall.webp',datePublished:'2026-08-08',dateModified:'2026-08-08',inLanguage:'sl',mainEntityOfPage:abs(url),author:{'@type':'Organization',name:'BREZ PRAHU'}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Izdelek',item:abs('/')},{'@type':'ListItem',position:2,name:'Nasveti',item:abs('/blog/')},{'@type':'ListItem',position:3,name:p.title,item:abs(url)}]},{'@type':'FAQPage',mainEntity:p.faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}]};
    return `<!doctype html><html lang="sl"><head>${blogHead(p.title,p.description,url)}<script type="application/ld+json">${JSON.stringify(ld)}</script></head><body><header class="blog-top"><a class="blog-brand" href="/">● BREZ PRAHU</a><nav><a href="/blog/">Nasveti</a></nav></header><main class="article-shell"><p class="crumb"><a href="/">Izdelek</a> / <a href="/blog/">Nasveti</a></p><article><header class="article-hero"><p class="eyebrow">VODIČ</p><h1>${esc(p.title)}</h1><p class="article-lead">${esc(p.lead)}</p></header><img class="article-img" src="/assets/wall.webp" alt="${esc(p.title)}">${sections}<div class="article-faq"><h2>Pogosta vprašanja</h2>${faq}</div></article><aside class="blog-cta"><h2>Manj prahu že pri naslednji luknji.</h2><p>Zbiralnik prahu priklopiš na sesalno cev in prah prestrežeš neposredno pri vrtini. Akcijska cena je 14,90 €.</p><a class="btn btn-primary" href="/#order">Naroči zbiralnik</a></aside><nav class="related"><h2>Preberi še</h2>${related}</nav></main></body></html>`;
  };

  write('blog/index.html',blogIndex());
  for(const p of posts) write(`blog/${p.slug}/index.html`,articlePage(p));
  return ['/blog/',...posts.map(p=>`/blog/${p.slug}/`)];
}
