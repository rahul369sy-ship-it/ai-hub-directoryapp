import { useState, useMemo } from "react";
import {
  Search, Star, ExternalLink, X, ChevronDown, Zap, Code2, Video,
  Mic, PenTool, Sparkles, Crown, Globe, Filter, BookOpen, Check,
  Award, TrendingUp, Layers, ArrowUpRight, Brain, Music, Image
} from "lucide-react";

// ─────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────
const TOOLS = [
  {
    id:1, name:"ChatGPT", category:"Writing", emoji:"💬",
    short_desc:"OpenAI's flagship AI assistant for writing, coding, research & creative work.",
    full_desc:"ChatGPT is OpenAI's revolutionary conversational AI powered by GPT-4o. It handles everything from creative writing to complex code, data analysis, image generation via DALL-E 3, and real-time web browsing. With millions of users worldwide and a thriving plugin ecosystem, it's the gold standard for AI assistants.",
    status:"Freemium", exact_price:"$20/mo", free_tier:"Free (GPT-4o mini)",
    website_url:"https://chat.openai.com", rating:4.9, reviewCount:125000,
    features:["GPT-4o (latest model)","DALL-E 3 image generation","Code interpreter","Custom GPT builder","Web browsing","Plugin ecosystem"],
    pros:["Most versatile AI tool available","Largest plugin library","Frequent model updates"],
    cons:["Best models require paid plan","Can occasionally hallucinate facts"],
    isFeatured:true, isSponsored:true,
  },
  {
    id:2, name:"Claude", category:"Writing", emoji:"🤖",
    short_desc:"Anthropic's safe & nuanced AI with 200K context window for deep work.",
    full_desc:"Claude by Anthropic is designed to be helpful, harmless, and honest. With a 200K token context window, it can analyze entire codebases, long documents, and complex research. Claude excels at nuanced writing, coding, and reasoning tasks with strong safety principles.",
    status:"Freemium", exact_price:"$20/mo", free_tier:"Free tier available",
    website_url:"https://claude.ai", rating:4.8, reviewCount:85000,
    features:["200K context window","Advanced reasoning","Code generation","Document analysis","Projects & Memory","Constitutional AI safety"],
    pros:["Excellent for long documents","Strong safety principles","Great coding abilities"],
    cons:["Fewer integrations than ChatGPT","Image generation not built-in"],
    isFeatured:true, isSponsored:false,
  },
  {
    id:3, name:"Midjourney", category:"Image", emoji:"🎨",
    short_desc:"The world's most popular AI image generator with stunning artistic output.",
    full_desc:"Midjourney is the gold standard for AI art generation, producing breathtakingly beautiful, hyper-realistic, and artistic images. Used by artists, designers, and creators worldwide, v6.1 delivers unprecedented quality with fine-tuned stylistic control via simple text prompts.",
    status:"Paid", exact_price:"$10/mo", free_tier:"No free tier",
    website_url:"https://midjourney.com", rating:4.9, reviewCount:95000,
    features:["v6.1 model (latest)","Style reference images","Character consistency","4× upscaling","Inpainting & variation","Discord & web interface"],
    pros:["Best image quality available","Huge style range","Active community"],
    cons:["No free tier","Learning curve for prompts"],
    isFeatured:true, isSponsored:true,
  },
  {
    id:4, name:"GitHub Copilot", category:"Coding", emoji:"⌨️",
    short_desc:"AI pair programmer that autocompletes code in any language or IDE.",
    full_desc:"GitHub Copilot, powered by OpenAI Codex, is the industry-leading AI code assistant. It suggests entire functions, writes tests, explains code, and helps debug. Integrated natively into VS Code, JetBrains IDEs, and more — it dramatically boosts developer productivity.",
    status:"Paid", exact_price:"$10/mo", free_tier:"Free for students/OSS",
    website_url:"https://github.com/features/copilot", rating:4.7, reviewCount:75000,
    features:["Code autocomplete","Copilot Chat","PR summaries","CLI assistance","IDE integrations","Multi-language support"],
    pros:["Best IDE integration","Huge language support","Enterprise-grade features"],
    cons:["Monthly subscription required","Occasional code hallucinations"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:5, name:"Cursor", category:"Coding", emoji:"🖱️",
    short_desc:"AI-first code editor built on VS Code with integrated Claude & GPT-4o.",
    full_desc:"Cursor is a next-generation code editor that puts AI at the center of your development workflow. Built on VS Code, it lets you chat with your codebase, apply AI edits across files, and generate entire features from a single prompt using Claude or GPT-4.",
    status:"Freemium", exact_price:"$20/mo", free_tier:"2-week free trial",
    website_url:"https://cursor.sh", rating:4.8, reviewCount:42000,
    features:["Chat with codebase","Multi-file editing","AI terminal","Copilot++ autocomplete","Custom AI rules","VS Code extension compatibility"],
    pros:["Revolutionary editor experience","Understands full codebase","Blazing fast"],
    cons:["Best models need paid plan","Newer product, still evolving"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:6, name:"v0 by Vercel", category:"Coding", emoji:"▲",
    short_desc:"Generate production-ready UI components from text prompts instantly.",
    full_desc:"v0 by Vercel generates fully functional React and shadcn/ui components from a simple text description. Perfect for rapid prototyping, it outputs clean, production-ready Tailwind CSS code that you can deploy to Vercel with one click.",
    status:"Freemium", exact_price:"$20/mo", free_tier:"Free credits monthly",
    website_url:"https://v0.dev", rating:4.7, reviewCount:28000,
    features:["React component generation","shadcn/ui integration","Tailwind CSS output","One-click Vercel deploy","Iterative refinement","Open-source code output"],
    pros:["Incredible for UI prototyping","Clean code output","Vercel ecosystem integration"],
    cons:["Limited free credits","Best suited for React/Next.js"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:7, name:"Runway Gen-3", category:"Video", emoji:"🎬",
    short_desc:"Hollywood-grade AI video generation and editing for creators.",
    full_desc:"Runway's Gen-3 Alpha is the most advanced AI video generation model available. Create stunning cinematic video from text or images, with precise control over camera motion, style, and timing. Used by major film studios and creators for professional-grade content.",
    status:"Freemium", exact_price:"$15/mo", free_tier:"125 credits free",
    website_url:"https://runwayml.com", rating:4.7, reviewCount:35000,
    features:["Gen-3 Alpha model","Text-to-video","Image-to-video","Motion brush","Background removal","Advanced video editing"],
    pros:["Best video generation quality","Professional creative toolkit","Film-grade outputs"],
    cons:["Expensive for heavy use","Limited generations on free plan"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:8, name:"ElevenLabs", category:"Voice", emoji:"🎙️",
    short_desc:"Ultra-realistic AI voice synthesis and voice cloning in 29 languages.",
    full_desc:"ElevenLabs produces the most natural, expressive AI voices available. Clone any voice in seconds, generate audiobooks, dub videos, or create custom voice characters. With 29+ language support and real-time voice generation, it's the industry standard for AI voice.",
    status:"Freemium", exact_price:"$5/mo", free_tier:"10k chars/mo free",
    website_url:"https://elevenlabs.io", rating:4.9, reviewCount:67000,
    features:["Voice cloning","29+ languages","Real-time voice gen","Dubbing studio","Sound effects","API access"],
    pros:["Most realistic AI voices","Excellent voice cloning","Huge language support"],
    cons:["Free tier is limited","Voice cloning requires consent"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:9, name:"Perplexity AI", category:"Research", emoji:"🔍",
    short_desc:"AI-powered search engine that answers with cited real-time sources.",
    full_desc:"Perplexity is the future of search — an AI that gives direct, sourced answers instead of links. Using real-time web data and multiple AI models (GPT-4o, Claude, Sonar), it provides comprehensive research with full citations, invaluable for professionals and students.",
    status:"Freemium", exact_price:"$20/mo", free_tier:"Free with limits",
    website_url:"https://perplexity.ai", rating:4.8, reviewCount:55000,
    features:["Real-time web search","Cited answers","Multiple AI models","Collections","Focus modes","API access"],
    pros:["Always up-to-date information","Full source citations","Clean interface"],
    cons:["Deep research needs Pro plan","Less nuanced than Claude/GPT-4"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:10, name:"Suno AI", category:"Voice", emoji:"🎵",
    short_desc:"Create full songs with vocals, instruments & lyrics from a simple prompt.",
    full_desc:"Suno is a revolutionary AI music generator that creates complete, radio-quality songs from a text prompt. Describe your desired genre, mood, and theme, and Suno generates full tracks with vocals, lyrics, and instrumentation in seconds.",
    status:"Freemium", exact_price:"$8/mo", free_tier:"50 songs/day free",
    website_url:"https://suno.ai", rating:4.7, reviewCount:32000,
    features:["Full song generation","Custom lyrics","50+ genres","Commercial license (Pro)","Cover art generation","Audio downloads"],
    pros:["Stunning music quality","Easy to use","Huge genre range"],
    cons:["Commercial use needs paid plan","Less control over individual instruments"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:11, name:"Adobe Firefly", category:"Image", emoji:"🔥",
    short_desc:"Adobe's AI trained on licensed content — safe for commercial projects.",
    full_desc:"Adobe Firefly is the generative AI engine built into Adobe Creative Cloud. Generate images, add or remove objects with Generative Fill, create text effects, and recolor vectors — all trained on licensed content, making it fully safe for commercial use.",
    status:"Freemium", exact_price:"$5/mo", free_tier:"25 credits/mo free",
    website_url:"https://firefly.adobe.com", rating:4.6, reviewCount:41000,
    features:["Generative Fill","Text-to-image","Text effects","Vector recoloring","Generative Expand","Commercially safe"],
    pros:["Commercially safe output","Deep Creative Cloud integration","Best Photoshop integration"],
    cons:["Fewer artistic styles than Midjourney","Credits can run out quickly"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:12, name:"Gamma", category:"Productivity", emoji:"⚡",
    short_desc:"Create beautiful presentations, docs & websites with AI in seconds.",
    full_desc:"Gamma is the fastest way to create beautiful presentations and documents. Just describe your topic and AI generates a fully designed, content-rich presentation instantly. With smart themes, real-time editing, and web publishing, it replaces PowerPoint for modern teams.",
    status:"Freemium", exact_price:"$15/mo", free_tier:"Free with watermark",
    website_url:"https://gamma.app", rating:4.7, reviewCount:29000,
    features:["AI presentation generation","Smart templates","Web publishing","Embeds & rich media","Analytics","Team collaboration"],
    pros:["Fastest way to create decks","Beautiful designs out-of-the-box","Easy sharing"],
    cons:["Watermark on free plan","Less customization than PowerPoint"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:13, name:"Grammarly", category:"Writing", emoji:"✍️",
    short_desc:"AI writing assistant for grammar, clarity, tone & style suggestions.",
    full_desc:"Grammarly is the world's leading AI writing assistant, helping over 30 million people write with confidence. Beyond grammar checking, it provides style suggestions, tone adjustments, plagiarism detection, and now generative AI writing via GrammarlyGO.",
    status:"Freemium", exact_price:"$12/mo", free_tier:"Basic — free forever",
    website_url:"https://grammarly.com", rating:4.7, reviewCount:89000,
    features:["Grammar & spell check","Style suggestions","Tone detector","Plagiarism checker","GrammarlyGO generative AI","Browser extension"],
    pros:["Works everywhere (browser, apps)","Extremely easy to use","Great for ESL users"],
    cons:["Best features behind paywall","Can over-suggest rewrites"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:14, name:"Stable Diffusion", category:"Image", emoji:"🌊",
    short_desc:"Open-source image generation you can run locally — 100% free forever.",
    full_desc:"Stable Diffusion by Stability AI is the most popular open-source image generation model. Run it locally on your own hardware with complete privacy, or use cloud interfaces like ComfyUI or Automatic1111. With thousands of fine-tuned models on CivitAI, the possibilities are endless.",
    status:"Free", exact_price:"Free", free_tier:"Fully free & open source",
    website_url:"https://stability.ai", rating:4.6, reviewCount:78000,
    features:["Fully open source","Local execution","Thousands of custom models","ControlNet","Inpainting & outpainting","SDXL & SD3 models"],
    pros:["Completely free forever","Privacy-first (runs locally)","Massive model ecosystem"],
    cons:["Requires technical knowledge","Hardware requirements for local use"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:15, name:"Synthesia", category:"Video", emoji:"📹",
    short_desc:"Create professional AI avatar videos in 130 languages — no camera needed.",
    full_desc:"Synthesia lets you create studio-quality videos with AI avatars in minutes — no camera, crew, or editing required. With 160+ AI avatars and 130 language support, it's the platform of choice for corporate training videos, product demos, and global content creation.",
    status:"Paid", exact_price:"$30/mo", free_tier:"Free demo available",
    website_url:"https://synthesia.io", rating:4.6, reviewCount:23000,
    features:["160+ AI avatars","130 languages & accents","Custom avatar creation","Brand kit","SCORM export","Team collaboration"],
    pros:["Professional video quality","No technical skill needed","Excellent for corporate use"],
    cons:["Expensive for individuals","Less creative freedom than Gen-3"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:16, name:"Notion AI", category:"Productivity", emoji:"📝",
    short_desc:"AI-powered writing, summarization & Q&A inside your Notion workspace.",
    full_desc:"Notion AI is integrated directly into your Notion workspace, allowing you to generate content, summarize long notes, translate, fix grammar, and ask questions about your entire workspace. It's the smartest way to supercharge your existing knowledge base.",
    status:"Paid", exact_price:"$10/mo", free_tier:"20 AI uses free",
    website_url:"https://notion.so/ai", rating:4.6, reviewCount:48000,
    features:["AI writing assistance","Workspace Q&A","Document summarization","Translation (30+ languages)","Content generation","Database AI fills"],
    pros:["Seamlessly integrated into Notion","Works on your existing data","Great for team wikis"],
    cons:["Requires Notion subscription","Add-on cost on top of Notion"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:17, name:"Jasper AI", category:"Writing", emoji:"🖊️",
    short_desc:"Enterprise-grade AI content platform for marketing teams and brands.",
    full_desc:"Jasper is the leading AI content platform built for marketing professionals. With brand voice training, 50+ templates, SEO integration, and multi-language support, it helps enterprise teams create on-brand content at scale across blogs, ads, email, and social media.",
    status:"Paid", exact_price:"$39/mo", free_tier:"7-day free trial",
    website_url:"https://jasper.ai", rating:4.6, reviewCount:31000,
    features:["Brand voice training","50+ content templates","SEO integration","Multi-language output","Team collaboration","API access"],
    pros:["Best for marketing teams","Consistent brand voice","Excellent template library"],
    cons:["Expensive for individuals","Learning curve for advanced features"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:18, name:"Copy.ai", category:"Writing", emoji:"📋",
    short_desc:"AI GTM platform for automating sales & marketing copy at scale.",
    full_desc:"Copy.ai has evolved from a copywriting tool into a full GTM AI platform for sales and marketing teams. Automate prospecting emails, nurture sequences, blog posts, and ad copy at scale with brand-aware AI workflows that integrate with your CRM.",
    status:"Freemium", exact_price:"$36/mo", free_tier:"2,000 words/mo free",
    website_url:"https://copy.ai", rating:4.5, reviewCount:27000,
    features:["GTM AI workflows","CRM integrations","90+ content templates","Brand voice","Multi-language","API access"],
    pros:["Great for sales automation","CRM integrations","Solid free tier"],
    cons:["Pricey for small teams","Interface can feel cluttered"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:19, name:"DALL-E 3", category:"Image", emoji:"🖼️",
    short_desc:"OpenAI's image model with best-in-class prompt adherence & text rendering.",
    full_desc:"DALL-E 3 by OpenAI offers exceptional text rendering in images, complex scene composition, and the ability to converse with ChatGPT to refine your generations. Available through ChatGPT Plus and the API — perfect for precise, prompt-accurate commercial imagery.",
    status:"Freemium", exact_price:"$20/mo", free_tier:"Limited via ChatGPT free",
    website_url:"https://openai.com/dall-e-3", rating:4.7, reviewCount:52000,
    features:["Exceptional text in images","Natural language prompting","High prompt accuracy","Safety systems","API access","ChatGPT integration"],
    pros:["Best text rendering in AI images","Easy conversational prompting","Great accuracy to prompts"],
    cons:["Artistic quality below Midjourney","Requires ChatGPT Plus for full access"],
    isFeatured:false, isSponsored:false,
  },
  {
    id:20, name:"Otter.ai", category:"Productivity", emoji:"🦦",
    short_desc:"AI meeting assistant that transcribes, summarizes & extracts action items.",
    full_desc:"Otter.ai automatically transcribes audio in real-time, identifies speakers, generates meeting summaries, and extracts action items. It integrates with Zoom, Google Meet, and Microsoft Teams to make every meeting more productive and searchable.",
    status:"Freemium", exact_price:"$17/mo", free_tier:"600 mins/mo free",
    website_url:"https://otter.ai", rating:4.5, reviewCount:44000,
    features:["Real-time transcription","Speaker identification","AI meeting summary","Action item extraction","Zoom/Meet/Teams integration","Team channels"],
    pros:["Saves hours of note-taking","Accurate transcription","Easy meeting sharing"],
    cons:["Accuracy drops with heavy accents","Storage limits on free plan"],
    isFeatured:false, isSponsored:false,
  },
];

const CATEGORIES = ["All","Writing","Image","Video","Coding","Voice","Productivity","Research"];
const SORT_OPTIONS = ["Top Rated","Free First","Price: Low to High","Name: A–Z"];
const CATEGORY_ICONS = {
  "All": Layers, "Writing": PenTool, "Image": Image, "Video": Video,
  "Coding": Code2, "Voice": Mic, "Productivity": Zap, "Research": BookOpen,
};
const STATUS_CFG = {
  Free: { bg:"bg-emerald-500/15", text:"text-emerald-400", border:"border-emerald-500/30" },
  Freemium: { bg:"bg-sky-500/15", text:"text-sky-400", border:"border-sky-500/30" },
  Paid: { bg:"bg-rose-500/15", text:"text-rose-400", border:"border-rose-500/30" },
};

// ─────────────────────────────────────────────
// TOOL CARD
// ─────────────────────────────────────────────
function ToolCard({ tool, onClick }) {
  const sc = STATUS_CFG[tool.status];
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(tool.rating));
  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col rounded-2xl border cursor-pointer overflow-hidden group`}
      style={{
        background: tool.isSponsored
          ? "linear-gradient(145deg,#0e0a1a,#0f1626)"
          : "#0b1120",
        borderColor: tool.isFeatured ? "rgba(168,85,247,0.45)" : "rgba(51,65,85,0.6)",
        boxShadow: tool.isFeatured
          ? "0 0 28px rgba(168,85,247,0.18), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = tool.isFeatured
          ? "0 20px 50px rgba(168,85,247,0.28), 0 0 0 1px rgba(168,85,247,0.5)"
          : "0 20px 50px rgba(6,182,212,0.12), 0 0 0 1px rgba(6,182,212,0.25)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = tool.isFeatured
          ? "0 0 28px rgba(168,85,247,0.18), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "inset 0 1px 0 rgba(255,255,255,0.03)";
      }}
    >
      {/* Sponsored top-accent line */}
      {tool.isSponsored && (
        <div style={{ height:"2px", background:"linear-gradient(90deg,#a855f7,#22d3ee,#f472b6)", opacity:0.9 }} />
      )}

      {/* Featured badge */}
      {tool.isFeatured && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
          style={{ background:"rgba(168,85,247,0.18)", border:"1px solid rgba(168,85,247,0.45)", color:"#c084fc" }}>
          <Crown size={9} />{tool.isSponsored ? "Sponsored" : "Featured"}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background:"rgba(15,23,42,0.9)", border:"1px solid rgba(71,85,105,0.5)" }}>
            {tool.emoji}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-base text-slate-100 truncate" style={{ fontFamily:"'Exo 2',sans-serif" }}>
              {tool.name}
            </h3>
            <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1"
              style={{ background:"rgba(6,182,212,0.12)", color:"#22d3ee", border:"1px solid rgba(6,182,212,0.25)" }}>
              {tool.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1"
          style={{ display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {tool.short_desc}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-4">
          {stars.map((filled, i) => (
            <Star key={i} size={11} fill={filled ? "#f59e0b" : "none"} color={filled ? "#f59e0b" : "#475569"} />
          ))}
          <span className="text-xs text-slate-500 ml-1">{tool.rating} · {(tool.reviewCount/1000).toFixed(0)}k reviews</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
              {tool.status}
            </span>
            <span className="text-sm font-bold text-white" style={{ fontFamily:"'Exo 2',sans-serif" }}>
              {tool.exact_price}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); window.open(tool.website_url,"_blank"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 transition-all"
            style={{ background:"linear-gradient(135deg,#22d3ee,#06b6d4)" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 18px rgba(6,182,212,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
          >
            Visit <ExternalLink size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AD PLACEHOLDER
// ─────────────────────────────────────────────
function AdBanner({ label, dims, inline }) {
  return (
    <div className="rounded-xl flex items-center justify-center text-slate-600 text-xs"
      style={{
        height: inline ? "80px" : dims,
        width: "100%",
        border: "1px dashed rgba(51,65,85,0.6)",
        background: "repeating-linear-gradient(45deg,rgba(6,182,212,0.02),rgba(6,182,212,0.02) 2px,transparent 2px,transparent 24px)",
      }}>
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="border border-slate-700 rounded px-1.5 py-0.5 text-slate-600 text-xs">AD</span>
          <span className="text-slate-600">{label}</span>
        </div>
        <div className="text-slate-700 text-xs">Google AdSense Placement</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────
function ToolModal({ tool, onClose }) {
  const sc = STATUS_CFG[tool.status];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(2,6,23,0.88)", backdropFilter:"blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-2xl border overflow-y-auto"
        style={{
          maxWidth:"680px", maxHeight:"88vh",
          background:"#0b1120",
          border: tool.isFeatured ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(51,65,85,0.7)",
          boxShadow:"0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(6,182,212,0.06)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {tool.isSponsored && (
          <div style={{ height:"2px", background:"linear-gradient(90deg,#a855f7,#22d3ee,#f472b6)" }} />
        )}

        {/* Header */}
        <div className="p-6 border-b border-slate-700/40 relative">
          <button onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white p-1.5 rounded-lg transition-all"
            style={{ background:"rgba(51,65,85,0.5)" }}>
            <X size={16} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background:"rgba(15,23,42,0.9)", border:"1px solid rgba(71,85,105,0.5)" }}>
              {tool.emoji}
            </div>
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h2 className="text-2xl font-black text-white" style={{ fontFamily:"'Exo 2',sans-serif" }}>{tool.name}</h2>
                {tool.isFeatured && (
                  <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background:"rgba(168,85,247,0.18)", border:"1px solid rgba(168,85,247,0.45)", color:"#c084fc" }}>
                    <Crown size={9} /> {tool.isSponsored ? "Sponsored" : "Featured"}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm px-3 py-0.5 rounded-full" style={{ background:"rgba(6,182,212,0.12)", color:"#22d3ee", border:"1px solid rgba(6,182,212,0.25)" }}>{tool.category}</span>
                <span className={`text-sm px-3 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>{tool.status}</span>
                <div className="flex items-center gap-1 text-sm text-amber-400">
                  <Star size={13} fill="#f59e0b" />
                  <span>{tool.rating}</span>
                  <span className="text-slate-500 text-xs">({tool.reviewCount?.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* About */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2" style={{ fontFamily:"'Exo 2',sans-serif" }}>About</h3>
            <p className="text-slate-300 leading-relaxed text-sm">{tool.full_desc}</p>
          </div>

          {/* Pricing card */}
          <div className="rounded-xl p-4 border border-slate-700/50 flex items-center justify-between gap-4"
            style={{ background:"rgba(15,23,42,0.7)" }}>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1" style={{ fontFamily:"'Exo 2',sans-serif" }}>Monthly Price</div>
              <div className="text-4xl font-black text-white" style={{ fontFamily:"'Exo 2',sans-serif" }}>{tool.exact_price}</div>
              {tool.free_tier && (
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><Check size={11} /> {tool.free_tier}</div>
              )}
            </div>
            <a href={tool.website_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 no-underline transition-all flex-shrink-0"
              style={{ background:"linear-gradient(135deg,#22d3ee,#06b6d4)" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 28px rgba(6,182,212,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
              Visit Website <ArrowUpRight size={15} />
            </a>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3" style={{ fontFamily:"'Exo 2',sans-serif" }}>Key Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {tool.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background:"rgba(6,182,212,0.12)", border:"1px solid rgba(6,182,212,0.28)" }}>
                    <Check size={9} style={{ color:"#22d3ee" }} />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 border border-emerald-500/20" style={{ background:"rgba(16,185,129,0.05)" }}>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3" style={{ fontFamily:"'Exo 2',sans-serif" }}>✓ Pros</h3>
              <ul className="space-y-2">
                {tool.pros.map((p, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold flex-shrink-0">+</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-4 border border-rose-500/20" style={{ background:"rgba(244,63,94,0.05)" }}>
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3" style={{ fontFamily:"'Exo 2',sans-serif" }}>✗ Cons</h3>
              <ul className="space-y-2">
                {tool.cons.map((c, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-rose-400 font-bold flex-shrink-0">−</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function AIToolsDirectory() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Top Rated");
  const [selectedTool, setSelectedTool] = useState(null);
  const [showSort, setShowSort] = useState(false);

  const filtered = useMemo(() => {
    let r = TOOLS;
    if (activeCategory !== "All") r = r.filter(t => t.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(t => t.name.toLowerCase().includes(q) || t.short_desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "Top Rated": return [...r].sort((a,b) => b.rating - a.rating);
      case "Free First": return [...r].sort((a,b) => ({Free:0,Freemium:1,Paid:2}[a.status])-({Free:0,Freemium:1,Paid:2}[b.status]));
      case "Price: Low to High": return [...r].sort((a,b) => (a.status==="Free"?0:parseInt(a.exact_price.replace(/\D/g,""))||0)-(b.status==="Free"?0:parseInt(b.exact_price.replace(/\D/g,""))||0));
      case "Name: A–Z": return [...r].sort((a,b)=>a.name.localeCompare(b.name));
      default: return r;
    }
  }, [search, activeCategory, sortBy]);

  const freeCount = TOOLS.filter(t => t.status==="Free").length;
  const freemiumCount = TOOLS.filter(t => t.status==="Freemium").length;
  const paidCount = TOOLS.filter(t => t.status==="Paid").length;

  // Build rows of 3 with an ad every 2 rows
  const grid = useMemo(() => {
    const items = [];
    const chunkSize = 3;
    for (let i = 0; i < filtered.length; i += chunkSize) {
      items.push({ type:"row", tools: filtered.slice(i, i+chunkSize) });
      if ((items.filter(x=>x.type==="row").length) % 2 === 0 && i + chunkSize < filtered.length) {
        items.push({ type:"ad", id: i });
      }
    }
    return items;
  }, [filtered]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#020617;}
        .aihub{font-family:'Plus Jakarta Sans',sans-serif;background:#020617;min-height:100vh;color:#e2e8f0;}
        .f-exo{font-family:'Exo 2',sans-serif;}
        @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes pulseGlow{0%,100%{opacity:1;}50%{opacity:0.5;}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .anim-fade-up{animation:fadeUp 0.5s ease forwards;}
        .grad-text{
          background:linear-gradient(135deg,#22d3ee 0%,#a855f7 50%,#f472b6 100%);
          background-size:200% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        .hero-glow{
          background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(6,182,212,0.07) 0%,transparent 70%),
                     radial-gradient(ellipse 50% 40% at 80% 20%,rgba(168,85,247,0.05) 0%,transparent 60%);
        }
        .grid-dots{
          background-image:radial-gradient(rgba(6,182,212,0.06) 1px,transparent 1px);
          background-size:32px 32px;
        }
        .search-wrap:focus-within{
          box-shadow:0 0 0 1px rgba(6,182,212,0.4),0 0 40px rgba(6,182,212,0.12);
        }
        .cat-active{
          background:linear-gradient(135deg,rgba(6,182,212,0.15),rgba(168,85,247,0.12))!important;
          border-color:rgba(6,182,212,0.45)!important;
          color:#22d3ee!important;
        }
        .scrollbar-hide::-webkit-scrollbar{display:none;}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none;}
      `}</style>

      <div className="aihub">

        {/* ── NAV ── */}
        <nav style={{ position:"sticky",top:0,zIndex:50,borderBottom:"1px solid rgba(51,65,85,0.5)",backdropFilter:"blur(20px)",background:"rgba(2,6,23,0.85)" }}>
          <div className="max-w-7xl mx-auto px-4" style={{ height:"60px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
              <div style={{ width:"34px",height:"34px",borderRadius:"10px",background:"linear-gradient(135deg,#06b6d4,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Sparkles size={16} color="white" />
              </div>
              <span className="f-exo" style={{ fontSize:"18px",fontWeight:800,color:"#fff",letterSpacing:"-0.5px" }}>
                AI<span style={{ color:"#22d3ee" }}>Hub</span>
              </span>
              <span style={{ fontSize:"11px",color:"#475569",border:"1px solid rgba(71,85,105,0.5)",borderRadius:"6px",padding:"1px 8px",marginLeft:"4px" }}>Directory</span>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:"24px" }}>
              {["Browse","Submit Tool","Newsletter"].map(l => (
                <a key={l} href="#" style={{ fontSize:"13px",color:"#94a3b8",textDecoration:"none",transition:"color 0.2s" }}
                  onMouseEnter={e=>e.target.style.color="#22d3ee"} onMouseLeave={e=>e.target.style.color="#94a3b8"}>{l}</a>
              ))}
              <button className="f-exo" style={{ fontSize:"13px",fontWeight:700,padding:"6px 18px",borderRadius:"10px",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#06b6d4,#a855f7)",color:"#fff" }}>
                Get Pro ✦
              </button>
            </div>
          </div>
        </nav>

        {/* ── LEADERBOARD AD (728×90) ── */}
        <div style={{ borderBottom:"1px solid rgba(51,65,85,0.3)",padding:"10px 0" }}>
          <div className="max-w-7xl mx-auto px-4" style={{ display:"flex",justifyContent:"center" }}>
            <AdBanner label="728×90 Leaderboard — Header Banner Ad" dims="90px" />
          </div>
        </div>

        {/* ── HERO ── */}
        <div className="hero-glow grid-dots" style={{ paddingTop:"64px",paddingBottom:"48px" }}>
          <div className="max-w-4xl mx-auto px-4 text-center anim-fade-up">
            {/* Pill badge */}
            <div style={{ display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(15,23,42,0.8)",border:"1px solid rgba(51,65,85,0.6)",borderRadius:"100px",padding:"6px 18px",fontSize:"13px",color:"#94a3b8",marginBottom:"24px",backdropFilter:"blur(10px)" }}>
              <span style={{ color:"#22d3ee",animation:"pulseGlow 2s ease-in-out infinite" }}>✦</span>
              200+ Curated AI Tools for Every Workflow
              <span style={{ color:"#a855f7",animation:"pulseGlow 2s ease-in-out infinite 0.8s" }}>✦</span>
            </div>

            <h1 className="f-exo grad-text" style={{ fontSize:"clamp(2.4rem,6vw,4.2rem)",fontWeight:900,lineHeight:1.1,letterSpacing:"-2px",marginBottom:"20px" }}>
              Discover the World's Best<br />AI Tools in One Place
            </h1>

            <p style={{ color:"#64748b",fontSize:"17px",lineHeight:1.7,marginBottom:"36px",maxWidth:"560px",margin:"0 auto 36px" }}>
              Search, compare & explore cutting-edge AI tools — from image generators to code assistants. Your AI stack starts here.
            </p>

            {/* Search */}
            <div className="search-wrap" style={{ maxWidth:"640px",margin:"0 auto 20px",background:"rgba(15,23,42,0.9)",border:"1px solid rgba(51,65,85,0.7)",borderRadius:"18px",display:"flex",alignItems:"center",padding:"12px 20px",transition:"box-shadow 0.3s",backdropFilter:"blur(20px)" }}>
              <Search size={20} color="#475569" style={{ flexShrink:0,marginRight:"12px" }} />
              <input
                type="text"
                placeholder="Search 200+ AI tools by name, category, or feature…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#e2e8f0",fontSize:"15px",fontFamily:"'Plus Jakarta Sans',sans-serif" }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ color:"#475569",background:"none",border:"none",cursor:"pointer",padding:"4px",borderRadius:"6px" }}>
                  <X size={16} />
                </button>
              )}
              <div style={{ marginLeft:"12px",paddingLeft:"12px",borderLeft:"1px solid rgba(51,65,85,0.5)",display:"flex",gap:"4px" }}>
                {["⌘","K"].map(k => (
                  <span key={k} style={{ background:"rgba(51,65,85,0.6)",borderRadius:"5px",padding:"2px 6px",fontSize:"11px",color:"#475569" }}>{k}</span>
                ))}
              </div>
            </div>

            {/* Quick tags */}
            <div style={{ display:"flex",justifyContent:"center",gap:"8px",flexWrap:"wrap" }}>
              {[["🤖 ChatGPT","ChatGPT"],["🎨 Image AI","Image"],["💻 Code AI","Coding"],["🎵 Voice AI","Voice"],["⚡ Free Only","Free"]].map(([label, q]) => (
                <button key={label}
                  onClick={() => { if (q === "Free") { setActiveCategory("All"); setSortBy("Free First"); } else if (["Image","Coding","Voice"].includes(q)) { setActiveCategory(q); } else setSearch(q); }}
                  style={{ fontSize:"12px",color:"#64748b",background:"rgba(15,23,42,0.7)",border:"1px solid rgba(51,65,85,0.4)",borderRadius:"100px",padding:"5px 14px",cursor:"pointer",transition:"all 0.2s",fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                  onMouseEnter={e=>{ e.target.style.color="#22d3ee"; e.target.style.borderColor="rgba(6,182,212,0.35)"; }}
                  onMouseLeave={e=>{ e.target.style.color="#64748b"; e.target.style.borderColor="rgba(51,65,85,0.4)"; }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ borderTop:"1px solid rgba(51,65,85,0.4)",borderBottom:"1px solid rgba(51,65,85,0.4)",background:"rgba(11,17,32,0.6)" }}>
          <div className="max-w-7xl mx-auto px-4" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",divideX:"1px solid red" }}>
            {[
              { label:"Total Tools",value:"200+",icon:Globe,color:"#22d3ee" },
              { label:"Free Tools",value:String(freeCount),icon:Zap,color:"#10b981" },
              { label:"Freemium",value:String(freemiumCount),icon:Award,color:"#a855f7" },
              { label:"Premium",value:String(paidCount),icon:Crown,color:"#f59e0b" },
            ].map(({ label,value,icon:Icon,color },i) => (
              <div key={label} style={{ padding:"18px 0",textAlign:"center",borderRight:i<3?"1px solid rgba(51,65,85,0.4)":"none" }}>
                <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:"6px",marginBottom:"4px" }}>
                  <Icon size={13} color={color} />
                  <span style={{ fontSize:"11px",color:"#475569",textTransform:"uppercase",letterSpacing:"0.1em" }}>{label}</span>
                </div>
                <div className="f-exo" style={{ fontSize:"26px",fontWeight:900,color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="max-w-7xl mx-auto px-4 py-8" style={{ display:"flex",gap:"28px" }}>

          {/* ── CONTENT ── */}
          <div style={{ flex:1,minWidth:0 }}>
            {/* Filters + Sort bar */}
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",marginBottom:"20px",flexWrap:"wrap" }}>
              <div className="scrollbar-hide" style={{ display:"flex",gap:"8px",overflowX:"auto",paddingBottom:"2px" }}>
                {CATEGORIES.map(cat => {
                  const Icon = CATEGORY_ICONS[cat];
                  const active = activeCategory === cat;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={active ? "cat-active" : ""}
                      style={{ display:"flex",alignItems:"center",gap:"6px",padding:"7px 14px",borderRadius:"10px",fontSize:"13px",fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s",fontFamily:"'Plus Jakarta Sans',sans-serif",background:active?"":"rgba(15,23,42,0.8)",border:active?"1px solid rgba(6,182,212,0.45)":"1px solid rgba(51,65,85,0.5)",color:active?"#22d3ee":"#94a3b8" }}
                      onMouseEnter={e=>{ if(!active){ e.currentTarget.style.borderColor="rgba(51,65,85,0.8)"; e.currentTarget.style.color="#e2e8f0"; }}}
                      onMouseLeave={e=>{ if(!active){ e.currentTarget.style.borderColor="rgba(51,65,85,0.5)"; e.currentTarget.style.color="#94a3b8"; }}}>
                      <Icon size={13} />{cat}
                    </button>
                  );
                })}
              </div>

              {/* Sort */}
              <div style={{ position:"relative",flexShrink:0 }}>
                <button onClick={() => setShowSort(!showSort)}
                  style={{ display:"flex",alignItems:"center",gap:"8px",padding:"7px 14px",background:"rgba(15,23,42,0.8)",border:"1px solid rgba(51,65,85,0.5)",borderRadius:"10px",fontSize:"13px",color:"#94a3b8",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  <Filter size={13} />{sortBy}
                  <ChevronDown size={13} style={{ transform:showSort?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s" }} />
                </button>
                {showSort && (
                  <div style={{ position:"absolute",right:0,top:"calc(100% + 8px)",background:"#0f1a2e",border:"1px solid rgba(51,65,85,0.7)",borderRadius:"14px",zIndex:40,overflow:"hidden",minWidth:"190px",boxShadow:"0 20px 60px rgba(0,0,0,0.6)" }}>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => { setSortBy(opt); setShowSort(false); }}
                        style={{ display:"flex",alignItems:"center",gap:"8px",width:"100%",textAlign:"left",padding:"10px 16px",fontSize:"13px",color:sortBy===opt?"#22d3ee":"#94a3b8",background:"none",border:"none",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"background 0.15s" }}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(51,65,85,0.4)"}
                        onMouseLeave={e=>e.currentTarget.style.background="none"}>
                        {sortBy===opt && <Check size={12} style={{ color:"#22d3ee" }} />}
                        {sortBy!==opt && <span style={{ width:"12px" }} />}
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Result count */}
            <p style={{ fontSize:"13px",color:"#475569",marginBottom:"20px" }}>
              Showing <span style={{ color:"#94a3b8",fontWeight:600 }}>{filtered.length}</span> tools
              {activeCategory !== "All" && <> in <span style={{ color:"#22d3ee" }}>{activeCategory}</span></>}
              {search && <> matching "<span style={{ color:"#22d3ee" }}>{search}</span>"</>}
            </p>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center",padding:"80px 0",color:"#475569" }}>
                <Brain size={52} style={{ margin:"0 auto 16px",opacity:0.25,display:"block" }} />
                <p style={{ fontSize:"18px" }}>No tools found</p>
                <p style={{ fontSize:"13px",marginTop:"6px" }}>Try adjusting your search or category filter</p>
              </div>
            ) : (
              <div>
                {grid.map((item, idx) => {
                  if (item.type === "ad") {
                    return (
                      <div key={`ad-${item.id}`} style={{ margin:"24px 0" }}>
                        <AdBanner label="728×90 In-Content Native Ad — Google AdSense" dims="80px" inline />
                      </div>
                    );
                  }
                  return (
                    <div key={idx} style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:"16px",marginBottom:"16px" }}>
                      {item.tools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} onClick={() => setSelectedTool(tool)} />
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <aside style={{ width:"280px",flexShrink:0,display:"none" }} className="lg-sidebar">
            <div style={{ position:"sticky",top:"76px",display:"flex",flexDirection:"column",gap:"20px" }}>

              {/* Sidebar Ad 300×250 */}
              <div>
                <p style={{ fontSize:"10px",color:"#334155",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"6px" }}>Advertisement</p>
                <div style={{ height:"250px",borderRadius:"14px",border:"1px dashed rgba(51,65,85,0.5)",background:"repeating-linear-gradient(45deg,rgba(6,182,212,0.02),rgba(6,182,212,0.02) 2px,transparent 2px,transparent 24px)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"6px",color:"#334155",fontSize:"12px" }}>
                  <span style={{ border:"1px solid rgba(51,65,85,0.4)",borderRadius:"4px",padding:"1px 8px",fontSize:"11px" }}>AD</span>
                  <span>Google AdSense</span>
                  <span style={{ color:"#1e293b" }}>300 × 250 Rectangle</span>
                  <code style={{ color:"#1e293b",fontSize:"10px" }}>data-ad-slot="XXXXXXX"</code>
                </div>
              </div>

              {/* Trending */}
              <div style={{ background:"rgba(11,17,32,0.8)",border:"1px solid rgba(51,65,85,0.5)",borderRadius:"16px",padding:"16px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px" }}>
                  <TrendingUp size={14} color="#f59e0b" />
                  <h3 className="f-exo" style={{ fontSize:"13px",fontWeight:700,color:"#e2e8f0" }}>🔥 Trending Now</h3>
                </div>
                {TOOLS.filter(t=>t.isFeatured).map((tool,i) => (
                  <button key={tool.id} onClick={() => setSelectedTool(tool)}
                    style={{ width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"10px 8px",borderBottom:i<2?"1px solid rgba(51,65,85,0.3)":"none",background:"none",border:"none",cursor:"pointer",textAlign:"left",borderRadius:"10px",transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(51,65,85,0.3)"}
                    onMouseLeave={e=>e.currentTarget.style.background="none"}>
                    <span style={{ fontSize:"22px" }}>{tool.emoji}</span>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:"13px",fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{tool.name}</div>
                      <div style={{ fontSize:"11px",color:"#475569" }}>{tool.category} · {tool.exact_price}</div>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:"2px",fontSize:"11px",color:"#f59e0b",flexShrink:0 }}>
                      <Star size={10} fill="#f59e0b" />{tool.rating}
                    </div>
                  </button>
                ))}
              </div>

              {/* Sidebar Ad 300×600 */}
              <div>
                <p style={{ fontSize:"10px",color:"#334155",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"6px" }}>Advertisement</p>
                <div style={{ height:"340px",borderRadius:"14px",border:"1px dashed rgba(51,65,85,0.5)",background:"repeating-linear-gradient(45deg,rgba(168,85,247,0.02),rgba(168,85,247,0.02) 2px,transparent 2px,transparent 24px)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"6px",color:"#334155",fontSize:"12px" }}>
                  <span style={{ border:"1px solid rgba(51,65,85,0.4)",borderRadius:"4px",padding:"1px 8px",fontSize:"11px" }}>AD</span>
                  <span>Google AdSense</span>
                  <span style={{ color:"#1e293b" }}>300 × 600 Half Page</span>
                  <code style={{ color:"#1e293b",fontSize:"10px" }}>data-ad-slot="XXXXXXX"</code>
                </div>
              </div>

            </div>
          </aside>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:"1px solid rgba(51,65,85,0.4)",padding:"32px 0",marginTop:"32px" }}>
          <div className="max-w-7xl mx-auto px-4" style={{ textAlign:"center" }}>
            <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:"8px",marginBottom:"10px" }}>
              <div style={{ width:"28px",height:"28px",borderRadius:"8px",background:"linear-gradient(135deg,#06b6d4,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Sparkles size={13} color="white" />
              </div>
              <span className="f-exo" style={{ fontWeight:800,color:"#64748b",fontSize:"15px" }}>
                AI<span style={{ color:"#22d3ee" }}>Hub</span> Directory
              </span>
            </div>
            <p style={{ fontSize:"12px",color:"#334155" }}>
              The world's most comprehensive AI tools directory · © 2025 AIHub · All rights reserved
            </p>
            <div style={{ display:"flex",justifyContent:"center",gap:"20px",marginTop:"14px" }}>
              {["Privacy","Terms","Advertise","Submit Tool","API"].map(l => (
                <a key={l} href="#" style={{ fontSize:"12px",color:"#334155",textDecoration:"none",transition:"color 0.2s" }}
                  onMouseEnter={e=>e.target.style.color="#22d3ee"} onMouseLeave={e=>e.target.style.color="#334155"}>{l}</a>
              ))}
            </div>
          </div>
        </footer>

        {/* ── MODAL ── */}
        {selectedTool && <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}

        {/* Sidebar responsive override */}
        <style>{`
          @media(min-width:1024px){.lg-sidebar{display:flex!important;flex-direction:column;}}
        `}</style>
      </div>
    </>
  );
}
