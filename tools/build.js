/* Regenerates the site's HTML pages from the shared template below.
 *
 * OPTIONAL. The site is plain HTML and needs no build step to work — this only
 * exists so the nav, sidebar and footer live in one place instead of five.
 * Edit the content strings below, then:  node tools/build.js
 * Requires Node; nothing else. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const SITE = 'https://s-pritam.github.io';
const GA = 'G-2LDELTXQ5G';
const UPDATED = 'September 2026';

const NAV = [
  ['/', 'Home'],
  ['/research/', 'Research'],
  ['/teaching/', 'Teaching'],
  ['/cv/', 'CV'],
];

const sun = `<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M6.5 6.5 4.9 4.9M19.1 19.1l-1.6-1.6M17.5 6.5l1.6-1.6M4.9 19.1l1.6-1.6"/></svg>`;
const moon = `<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z"/></svg>`;
const bars = `<svg class="i-bars" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17"/></svg>`;
const close = `<svg class="i-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/></svg>`;

/* Icons: Font Awesome 6 Free (CC BY 4.0), the set academicpages uses, inlined
   as SVG so the page makes no request for them. Geometry in tools/icons.json
   is lifted verbatim from the Font Awesome bundle. */
const RAW = JSON.parse(fs.readFileSync(path.join(__dirname, 'icons.json'), 'utf8'));
const ICONS = Object.fromEntries(Object.entries(RAW).map(([k, v]) =>
  [k, `<svg class="ico" viewBox="0 0 ${v.w} ${v.h}" aria-hidden="true" focusable="false"><path d="${v.d}"/></svg>`]));

const link = (href, icon, label, rel) =>
  `<a href="${href}"${rel ? ` rel="${rel}"` : ''}>${ICONS[icon]}<span>${label}</span></a>`;

/* The sidebar is identical on every page — soft navigation swaps only <main>,
   so this markup is never re-rendered while the visitor moves around. */
const chevron = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 15.25 12 8.75l6.5 6.5"/></svg>`;

const PROFILE = `      <aside class="profile" id="profile">
       <div class="profile__inner" id="profile-inner">
        <img class="profile__photo" src="/assets/img/portrait.jpg" width="560" height="759" alt="Pritam Saha" decoding="async">
        <p class="profile__name">Pritam Saha</p>
        <p class="profile__title">Postdoctoral Researcher</p>
        <p class="profile__org"><a href="https://genevaresearchlab.org/en/" rel="noopener">Geneva Research Lab for Digital Impact</a><br>University of Geneva</p>
        <p class="profile__contact">
          ${ICONS['envelope']}<a href="mailto:pritam.saha@unige.ch">pritam.saha@unige.ch</a><br>
          <span class="profile__addr">Uni Mail, Bureau 3332<br>Bd du Pont d'Arve 40<br>1205 Geneva, Switzerland</span>
        </p>
        <nav class="profile__links" aria-label="Profiles and documents">
          ${link('/files/CV.pdf', 'file-pdf', 'CV (PDF)')}
          ${link('https://orcid.org/0009-0007-2255-5233', 'orcid', 'ORCID', 'me noopener')}
          ${link('https://www.unige.ch/gsem/en/research/institutes/iom/team/fellows/pritam-saha', 'building-columns', 'UNIGE', 'me noopener')}
          ${link('https://github.com/s-pritam', 'github', 'GitHub', 'me noopener')}
          ${link('https://www.linkedin.com/in/s-pritam', 'linkedin-in', 'LinkedIn', 'me noopener')}
          ${link('https://x.com/pritam_s_', 'x-twitter', 'X', 'me noopener')}
        </nav>
       </div>
       <button class="profile__toggle" type="button" id="profile-toggle" aria-controls="profile-inner" aria-expanded="true" aria-label="Hide profile">
         ${chevron}
       </button>
      </aside>`;

function page({ url, title, desc, content, jsonld, noindex }) {
  const nav = NAV.map(([href, label]) =>
    `        <a href="${href}"${href === url ? ' aria-current="page"' : ''}>${label}</a>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
${noindex ? '<meta name="robots" content="noindex">\n' : `<link rel="canonical" href="${SITE}${url}">\n`}<meta name="theme-color" content="#fcfbf9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#141412" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="${url === '/' ? 'profile' : 'website'}">
<meta property="og:site_name" content="Pritam Saha">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}${url}">
<meta property="og:image" content="${SITE}/assets/img/portrait.jpg">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/assets/img/favicon.ico" sizes="any">
<link rel="preload" href="/assets/fonts/newsreader-400600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
<script>(function(){var d=document.documentElement;d.className+=' js';try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){d.setAttribute('data-theme',t);}}catch(e){}})();</script>
${jsonld ? `<script type="application/ld+json">\n${jsonld}\n</script>\n` : ''}</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<header class="topbar" id="topbar">
  <div class="topbar__inner">
    <a class="wordmark" href="/">Pritam Saha</a>
    <nav class="nav" id="site-nav" aria-label="Primary">
${nav}
    </nav>
    <button class="theme-toggle" type="button" id="theme-toggle" aria-label="Switch to dark theme">
      ${sun}
      ${moon}
    </button>
    <button class="nav-toggle" type="button" id="nav-toggle" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">
      ${bars}
      ${close}
    </button>
  </div>
</header>

    <div class="layout">
${PROFILE}

      <main class="content" id="main" tabindex="-1">
${content}
      </main>
    </div>

<footer class="footer">
  <div class="footer__inner">
    <span>&copy; 2026 Pritam Saha</span>
    <span>Last updated: ${UPDATED}</span>
  </div>
</footer>

<script src="/assets/js/site.js" defer></script>
${noindex ? '' : `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA}');</script>
`}</body>
</html>
`;
}

/* ------------------------------------------------------------------ people */
/* Coauthor affiliations, each taken from that person's own page. */
const A = {
  /* Two entries for the same person on purpose: the published paper carries the
     affiliation printed on it, the unpublished one carries his current post. */
  bahurePublished: '<a href="https://vikrambahure.github.io/" class="lnk" rel="noopener">Vikram Bahure</a> (King&rsquo;s College London)',
  bahure: '<a href="https://vikrambahure.github.io/" class="lnk" rel="noopener">Vikram Bahure</a> (Public First)',
  ghosh: '<a href="https://www.sanjanaghosh.com/" class="lnk" rel="noopener">Sanjana Ghosh</a> (Ashoka University)',
  jean: '<a href="https://ljean-eco.github.io/" class="lnk" rel="noopener">L&eacute;o Jean</a> (CIRED)',
  cardoso: '<a href="https://www.diegoscardoso.com/" class="lnk" rel="noopener">Diego S. Cardoso</a> (University of Illinois Urbana-Champaign)',
  daubanes: '<a href="https://www.jxdaubanes.com/" class="lnk" rel="noopener">Julien Daubanes</a> (Technical University of Denmark)',
  katovich: '<a href="https://ekatovich.github.io/" class="lnk" rel="noopener">Erik Katovich</a> (University of Connecticut)',
  agarwal: '<a href="https://www.bsg.ox.ac.uk/people/madhuri-agarwal" class="lnk" rel="noopener">Madhuri Agarwal</a> (Blavatnik School of Government, University of Oxford)',
};

/* ------------------------------------------------------------------- pages */

const jsonld = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pritam Saha",
  url: SITE + "/",
  image: SITE + "/assets/img/portrait.jpg",
  jobTitle: "Postdoctoral Researcher",
  email: "mailto:pritam.saha@unige.ch",
  identifier: "https://orcid.org/0009-0007-2255-5233",
  affiliation: [
    { "@type": "Organization", name: "Geneva Research Lab for Digital Impact, University of Geneva", url: "https://genevaresearchlab.org/en/" },
    { "@type": "Organization", name: "Geneva School of Economics and Management, University of Geneva", url: "https://www.unige.ch/gsem/en/research/institutes/iom/team/fellows/pritam-saha" }
  ],
  alumniOf: [
    { "@type": "Organization", name: "University of Geneva" },
    { "@type": "Organization", name: "Jadavpur University" }
  ],
  knowsAbout: ["Education", "Digital Transformation", "Development Economics", "Energy Economics", "Environmental Economics", "Resource Economics", "Applied Microeconomics"],
  sameAs: ["https://orcid.org/0009-0007-2255-5233", "https://github.com/s-pritam", "https://www.linkedin.com/in/s-pritam", "https://x.com/pritam_s_"]
}, null, 2);

const home = `        <h1 class="page-h">About</h1>
        <div class="prose">
          <p class="lede">I am a postdoctoral researcher at the <a href="https://genevaresearchlab.org/en/" class="lnk" rel="noopener">Geneva Research Lab for Digital Impact</a>, a joint initiative of the <a href="https://www.unige.ch/gsem/en/" class="lnk" rel="noopener">Geneva School of Economics and Management</a> at the University of Geneva and UNICEF&rsquo;s Digital Impact Division. My current research lies at the intersection of education, digital transformation, and development. I study how unequal access to digital infrastructure contributes to the digital divide and how investments in connectivity can expand educational opportunities.</p>

          <p>I received my Ph.D. in Economics from the University of Geneva in 2026, under the supervision of <a href="https://sites.google.com/site/giacomodegiorgi/" class="lnk" rel="noopener">Giacomo De Giorgi</a>. My doctoral research spanned energy, environmental and resource economics, as well as development economics. A central part of my work examined the oil and gas industry, focusing on how firms respond to climate policies and how these responses shape extraction, investment, ownership, and emissions, as well as the resulting misallocation of polluting resources. During my Ph.D., I was a visiting scholar at the <a href="https://www.man.dtu.dk/english" class="lnk" rel="noopener">Technical University of Denmark</a>.</p>

          <p>You can find <a href="/research/" class="lnk">more about my research</a> here.</p>
        </div>`;

const research = `        <h1 class="page-h">Research</h1>
        <p class="lede">Energy, environment and resource economics, and development economics. Most of the work is empirical, and asks how firms and households respond when policy changes the incentives they face.</p>

        <section class="group">
          <h2 class="group__title">Publications</h2>
          <article class="paper">
            <h3 class="paper__title">Network Size and Temporary Migration</h3>
            <p class="paper__meta">With ${A.bahurePublished} &middot; <span class="paper__venue"><em>Review of Development Economics</em>, 29(4), 2414&ndash;2430, 2025</span></p>
            <p class="paper__links"><a href="https://doi.org/10.1111/rode.13233" rel="noopener">Link${ICONS['arrow-up-right-from-square']}</a></p>
            <details>
              <summary>Abstract</summary>
              <p class="paper__abstract">In this study, we explore the impact of network size on temporary migration, using data from the Indian Human Development Survey 2011&ndash;12. Network size indicates the availability of informal risk-sharing for rural households, with temporary migration acting as another self-insurance method. We demonstrate that the effect of network size on migration is contingent upon the network&rsquo;s endowment, particularly emphasizing the role of credit constraints in low-endowed networks. The findings reveal that larger network sizes reduce temporary migration in high-endowed upper-caste networks but increase in less-endowed lower-caste networks. This association is supported using historical caste population data from the 1961 census and regions dominated by non-migrants. We further ascertain that enhanced network size alleviates credit constraints in lower-endowed networks, driven by the network&rsquo;s income and influenced by exogenous rainfall shocks.</p>
            </details>
          </article>
        </section>

        <section class="group">
          <h2 class="group__title">Projects</h2>
          <article class="paper">
            <h3 class="paper__title">Impact of School Connectivity on Learning Outcomes</h3>
            <p class="paper__meta"><a href="https://genevaresearchlab.org/en/" class="lnk" rel="noopener">The Geneva Research Lab for Digital Impact</a> &middot; 2026</p>
            <p class="tag">Current</p>
          </article>
          <article class="paper">
            <h3 class="paper__title">The oil and gas industry&rsquo;s behaviour in front of climate policy</h3>
            <p class="paper__meta">Swiss National Science Foundation &amp; University of Geneva &middot; 2022&ndash;2024</p>
            <p class="paper__links"><a href="https://data.snf.ch/grants/grant/192578" rel="noopener">Link${ICONS['arrow-up-right-from-square']}</a></p>
          </article>
        </section>

        <section class="group">
          <h2 class="group__title">Working papers</h2>
          <article class="paper">
            <h3 class="paper__title">Voice Until the Last Exit: Ownership Structure and the Limits of Voluntary Environmental Commitments</h3>
            <p class="paper__meta">With ${A.ghosh} and ${A.jean}</p>
            <p class="paper__links"><a href="https://www.sanjanaghosh.com/files/Ownership_Structure_and_Environmental_Outcomes_in_Oil_and_Gas__Draft.pdf" rel="noopener">Draft (PDF)</a></p>
            <details>
              <summary>Abstract</summary>
              <p class="paper__abstract">The effectiveness of corporate climate initiatives depends not only on firms&rsquo; commitments but also on existing asset ownership structure. We study this question in the context of the World Bank&rsquo;s Zero Routine Flaring by 2030 initiative, under which oil and gas companies pledge to eliminate routine flaring from their assets. Using asset-level ownership and satellite-based flaring measurements for nearly 20,000 oil and gas assets worldwide (2012&ndash;2024), we exploit staggered firm endorsements to study how committed firms navigate the tradeoff between voice, exercising governance influence to reduce emissions, and exit, divesting from assets that are costly to decarbonize. Committed ownership reduces flaring gradually but persistently, reaching approximately 45% below pre-commitment levels after nine years. The persistence of these gains hinges on continued committed presence: when the last committed owner divests, flaring rises by roughly 40% within two years and exceeds 90% within six years, a result we term the &lsquo;last good owner effect&rsquo;. Retaining at least one committed voice on the board is both necessary and sufficient to sustain emissions discipline.</p>
            </details>
          </article>
          <article class="paper">
            <h3 class="paper__title">Supply Response to Oil Production Taxes: Evidence from the US Royalty Relief Program</h3>
            <p class="paper__meta">With ${A.cardoso}, ${A.daubanes} and ${A.katovich}</p>
          </article>
        </section>

        <section class="group">
          <h2 class="group__title">Work in progress</h2>
          <article class="paper">
            <h3 class="paper__title">Unlocking Potential: The Causal Impact of Credit to Women on Household Consumption and Income in Rural India</h3>
            <p class="paper__meta">With ${A.agarwal} and ${A.bahure}</p>
            <details>
              <summary>Abstract</summary>
              <p class="paper__abstract">The effectiveness of microfinance in fostering well-being, particularly that of women, remains debatable. This study leverages causal inference techniques to assess the impact of credit on household consumption and income when it is provided to women versus men. Using migrant loan application data from Shram Sarthi, a financial institution in rural Rajasthan, India, we employ an instrumental variable approach to identify the gender of loan applicants and address selection bias. The analysis reveals a significant increase in household consumption and income when credit is provided to women. Improved access to credit empowers women to manage resources effectively and navigate income and health shocks, particularly in disadvantaged migrant households. Consequently, male migrants can potentially pursue higher-return economic activities. These findings suggest that providing credit to women stabilizes household consumption and boosts income, highlighting its potential as a tool for women&rsquo;s empowerment and poverty alleviation in migrant communities.</p>
            </details>
          </article>
          <article class="paper">
            <h3 class="paper__title">Effect of Subsidies on Investment in the Oil and Gas Sector: Evidence from Norway</h3>
            <p class="paper__meta">Solo-authored</p>
          </article>
        </section>

`;

const teaching = `        <h1 class="page-h">Teaching</h1>
        <p class="lede">Research and teaching assistant at the University of Geneva, 2021&ndash;2026, across the undergraduate and graduate programmes in economics.</p>

        <section class="group">
          <h2 class="group__title">Courses</h2>
          <div class="rows">
            <div class="row"><div class="row__k">2021&ndash;26</div><div class="row__v"><strong>Introduction to Microeconomics</strong><span class="row__sub">Undergraduate &middot; Course Coordinator<br>with Fr&eacute;d&eacute;ric Robert-Nicoud, Federica Sbergami, J&eacute;r&eacute;my Laurent-Lucchetti and Giovanni Ferro Luzzi</span></div></div>
            <div class="row"><div class="row__k">2026</div><div class="row__v"><strong>Development Economics</strong><span class="row__sub">Undergraduate &middot; with Giacomo De Giorgi and Alejandra Ramos</span></div></div>
            <div class="row"><div class="row__k">2023&ndash;24</div><div class="row__v"><strong>Development Economics</strong><span class="row__sub">Graduate &middot; with Giacomo De Giorgi</span></div></div>
            <div class="row"><div class="row__k">2022</div><div class="row__v"><strong>Microeconomics II</strong><span class="row__sub">Undergraduate &middot; with Saraly Andrade de S&aacute;</span></div></div>
            <div class="row"><div class="row__k">2021</div><div class="row__v"><strong>Sustainable Economic Development</strong><span class="row__sub">Graduate &middot; with Salvatore Di Falco</span></div></div>
          </div>
        </section>`;

const cv = `        <h1 class="page-h">Curriculum vit&aelig;</h1>
        <p class="lede">A PDF version is available to <a href="/files/CV.pdf" class="lnk">download</a>.</p>

        <div class="pdfbar">
          <a class="pdfbar__btn" href="/files/CV.pdf" target="_blank" rel="noopener">Open in new tab</a>
        </div>
        <div class="pdfbox" id="pdfbox">
          <object class="pdfbox__doc" data="/files/CV.pdf#toolbar=0&amp;navpanes=0" type="application/pdf" aria-label="Curriculum vitae of Pritam Saha (PDF)">
            <div class="pdfbox__fallback">
              <p>This browser will not display the PDF inline.</p>
              <p><a class="btn" href="/files/CV.pdf">Open the CV (PDF)</a></p>
            </div>
          </object>
        </div>
        <div class="pdfbox__small">
          <p>Inline PDFs do not read well on a small screen, so open it directly instead.</p>
          <p><a class="btn" href="/files/CV.pdf">Open the CV (PDF)</a></p>
        </div>`;

const notfound = `        <h1 class="page-h">Page not found</h1>
        <p class="lede">This link may be out of date &mdash; the site was rebuilt and a few old addresses did not survive the move.</p>
        <div class="prose">
          <p>Try <a href="/" class="lnk">the homepage</a>, <a href="/research/" class="lnk">research</a>, <a href="/teaching/" class="lnk">teaching</a>, or the <a href="/cv/" class="lnk">CV</a>.</p>
        </div>`;

const pages = [
  { file: 'index.html', url: '/', title: 'Pritam Saha', desc: 'Pritam Saha is a postdoctoral researcher at the Geneva Research Lab for Digital Impact, University of Geneva, working on education, digital transformation and development, and on energy and environmental economics.', content: home, jsonld },
  { file: 'research/index.html', url: '/research/', title: 'Research — Pritam Saha', desc: 'Publications, projects, working papers and work in progress on the oil and gas industry, environmental commitments, migration and credit.', content: research },
  { file: 'teaching/index.html', url: '/teaching/', title: 'Teaching — Pritam Saha', desc: 'Courses taught and coordinated at the University of Geneva, thesis examining, and mentoring.', content: teaching },
  { file: 'cv/index.html', url: '/cv/', title: 'CV — Pritam Saha', desc: 'Curriculum vitae of Pritam Saha: employment, education, research, projects, talks, teaching, service and skills.', content: cv },
  { file: '404.html', url: '/404.html', title: 'Page not found — Pritam Saha', desc: 'Page not found.', content: notfound, noindex: true },
];

for (const p of pages) {
  const out = path.join(ROOT, p.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(p));
  console.log('wrote', p.file.padEnd(20), (fs.statSync(out).size / 1024).toFixed(1) + 'KB');
}
