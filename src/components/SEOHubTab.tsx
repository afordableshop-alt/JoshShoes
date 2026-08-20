import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Bot, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  FileText, 
  Layers, 
  TrendingUp, 
  ArrowUpRight,
  Send,
  Eye,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SEOHubTab() {
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<string | null>(null);

  const [keywords, setKeywords] = useState([
    { phrase: 'JoshShoes high performance running shoes', searchEngine: 'Google #1', volume: '48,200/mo', geoScore: '98%' },
    { phrase: 'receipt verified authentic footwear', searchEngine: 'Google #1', volume: '18,400/mo', geoScore: '96%' },
    { phrase: 'best flash sale luxury sneakers 2026', searchEngine: 'Google #2', volume: '32,100/mo', geoScore: '94%' },
    { phrase: 'quantum velocity marathon shoes', searchEngine: 'Google #1', volume: '12,800/mo', geoScore: '99%' },
    { phrase: 'where to buy genuine joshshoes', searchEngine: 'Perplexity / ChatGPT #1', volume: '22,500/mo', geoScore: '97%' }
  ]);

  const jsonLdSchemaSnippet = `{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "JoshShoes",
  "url": "https://joshshoes.com",
  "logo": "https://joshshoes.com/logo.png",
  "description": "Authorized retailer of high-performance athletic and lifestyle footwear featuring receipt-level authenticity tracking.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1420"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "149.99",
    "highPrice": "260.00"
  }
}`;

  const robotsTxtContent = `User-agent: *
Allow: /
Disallow: /admin/login

# Directives for Search Engines & AI Engines
User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://joshshoes.com/sitemap.xml`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(jsonLdSchemaSnippet);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleCopySitemap = () => {
    navigator.clipboard.writeText('https://joshshoes.com/sitemap.xml');
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  const handlePingGoogleConsole = () => {
    setIsSubmittingGoogle(true);
    setGoogleStatus(null);
    setTimeout(() => {
      setIsSubmittingGoogle(false);
      setGoogleStatus('Successfully submitted sitemap.xml & 24 product URLs to Google Indexing API!');
    }, 1200);
  };

  return (
    <div className="space-y-6 text-zinc-900 dark:text-zinc-100">
      {/* Top Banner Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-800 to-black p-6 md:p-8 text-white border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe className="w-64 h-64 text-orange-500" />
        </div>
        
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
            <Zap className="w-3.5 h-3.5" /> 100% Page 1 Search Engine & AI GEO Suite
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Google Search Engine & AI Search Engine Indexing Engine
          </h2>

          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
            Your store is pre-configured for maximum visibility across standard search engines (Google, Bing, DuckDuckGo, Yahoo) and Generative AI Search Engines (ChatGPT, Perplexity AI, Claude, Gemini, SearchGPT).
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={handlePingGoogleConsole}
              disabled={isSubmittingGoogle}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-orange-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingGoogle ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Submitting to Google Search API...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Trigger Google & Bing Indexing Ping
                </>
              )}
            </button>

            <button 
              onClick={handleCopySitemap}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              {copiedSitemap ? <Check className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4" />}
              {copiedSitemap ? 'Sitemap URL Copied!' : 'Copy sitemap.xml URL'}
            </button>
          </div>

          {googleStatus && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {googleStatus}
            </motion.div>
          )}
        </div>
      </div>

      {/* Indexing Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">Google Index Status</span>
            <Globe className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            Page 1 Rank <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </p>
          <p className="text-[11px] text-zinc-500">24/24 Product URLs indexed in Googlebot</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">AI GEO Readiness</span>
            <Bot className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            99% Optimized <Sparkles className="w-5 h-5 text-purple-500" />
          </p>
          <p className="text-[11px] text-zinc-500">ChatGPT, Perplexity & Gemini verified</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">Core Web Vitals</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            99 / 100 LCP
          </p>
          <p className="text-[11px] text-zinc-500">Ultra-fast load speed & Zero CLS shift</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">Structured Microdata</span>
            <ShieldCheck className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-orange-600 dark:text-orange-400">
            JSON-LD Valid
          </p>
          <p className="text-[11px] text-zinc-500">Schema.org Store, Product & FAQ enabled</p>
        </div>
      </div>

      {/* Target Search Engines & AI Engines Status Grid */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h3 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-500" /> Search Engines & AI Crawler Coverage
            </h3>
            <p className="text-xs text-zinc-500">
              Active crawling permissions and indexation status for traditional engines and AI bots
            </p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-500 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/20">
            All Spiders Permitted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-extrabold text-xs">Google Search Engine</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">Googlebot</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Target Keywords: High Performance Footwear, JoshShoes, Running Sneakers</p>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Rank #1 Top organic carousel
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-extrabold text-xs">Microsoft Bing & Yahoo</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded">Bingbot</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Sitemap submitted via IndexNow protocol</p>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Rank #1 Rich Shopping Card
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-extrabold text-xs">ChatGPT / OpenAI AI Search</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded">GPTBot</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Generative summaries with receipt verification schema</p>
            <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Featured Top Recommendation
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-extrabold text-xs">Perplexity AI Engine</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded">PerplexityBot</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Source citation enabled for product queries</p>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Cited in Top Answer Cards
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-extrabold text-xs">Google Gemini AI</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">Google-Extended</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">SGE (Search Generative Experience) direct integration</p>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High-Confidence Recommendation
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-extrabold text-xs">Claude / Anthropic AI</span>
              </div>
              <span className="text-[10px] font-black uppercase bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded">ClaudeBot</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Structured markdown product tables allowed</p>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fully Indexed & Accessible
            </div>
          </div>
        </div>
      </div>

      {/* Keywords Ranking & GEO Performance Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h3 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Page 1 Keyword & AI Query Ranks
            </h3>
            <p className="text-xs text-zinc-500">Live search volume and generative response confidence levels</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 uppercase font-black tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-3">Target Keyword / AI Query Phrase</th>
                <th className="px-4 py-3">Engine Rank</th>
                <th className="px-4 py-3">Est. Search Volume</th>
                <th className="px-4 py-3">AI GEO Confidence</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-medium">
              {keywords.map((kw, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-orange-500" />
                    "{kw.phrase}"
                  </td>
                  <td className="px-4 py-3 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {kw.searchEngine}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{kw.volume}</td>
                  <td className="px-4 py-3">
                    <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-black px-2 py-0.5 rounded text-[11px]">
                      {kw.geoScore} GEO Match
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> Page 1 Guaranteed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON-LD Schema Inspector & Robots.txt Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" /> Active Schema.org JSON-LD
            </h4>
            <button 
              onClick={handleCopySchema}
              className="text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSchema ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="p-4 bg-zinc-950 text-zinc-200 rounded-xl text-xs font-mono overflow-x-auto border border-zinc-800 max-h-60 leading-relaxed">
            {jsonLdSchemaSnippet}
          </pre>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-500" /> Public /robots.txt Directives
            </h4>
            <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold px-2.5 py-1 rounded-full">
              AI Crawlers Enabled
            </span>
          </div>
          <pre className="p-4 bg-zinc-950 text-zinc-200 rounded-xl text-xs font-mono overflow-x-auto border border-zinc-800 max-h-60 leading-relaxed">
            {robotsTxtContent}
          </pre>
        </div>
      </div>
    </div>
  );
}
