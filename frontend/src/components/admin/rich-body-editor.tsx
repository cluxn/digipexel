"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Upload, X, Eye, Code2, GripHorizontal, Trash2, Pencil, Undo2, Redo2, Info, Megaphone } from "lucide-react";
import { uploadFile, cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

// ── Constants ─────────────────────────────────────────────────────────────────
const SIZE_PRESETS = [
  { label: "Thumbnail", px: 160  },
  { label: "Small",     px: 320  },
  { label: "Medium",    px: 480  },
  { label: "Large",     px: 640  },
  { label: "XL",        px: 800  },
  { label: "Banner",    px: 1024 },
  { label: "Full Width",px: 0    },
] as const;

const TEXT_COLORS = [
  "#0F172A","#475569","#94A3B8","#EF4444","#F97316",
  "#EAB308","#22C55E","#3B82F6","#8B5CF6","#EC4899","#14B8A6","#FFFFFF",
] as const;

const HIGHLIGHT_COLORS = [
  { label:"Yellow",  c:"#FEF08A" },
  { label:"Green",   c:"#BBF7D0" },
  { label:"Blue",    c:"#BFDBFE" },
  { label:"Pink",    c:"#FBCFE8" },
  { label:"Purple",  c:"#E9D5FF" },
  { label:"Orange",  c:"#FED7AA" },
  { label:"Red",     c:"#FECACA" },
  { label:"Remove",  c:"transparent" },
] as const;

const FONT_SIZES = [
  { label:"Tiny",   val:"0.75em"  },
  { label:"Small",  val:"0.875em" },
  { label:"Normal", val:null      },
  { label:"Large",  val:"1.25em"  },
  { label:"XL",     val:"1.5em"   },
  { label:"XXL",    val:"2em"     },
] as const;

const BLOCK_TYPES = [
  { label:"Normal",     tag:"p"          },
  { label:"Heading 1",  tag:"h1"         },
  { label:"Heading 2",  tag:"h2"         },
  { label:"Heading 3",  tag:"h3"         },
  { label:"Heading 4",  tag:"h4"         },
  { label:"Heading 5",  tag:"h5"         },
  { label:"Blockquote", tag:"blockquote" },
  { label:"Code Block", tag:"pre"        },
] as const;

type ImgAlign   = "center" | "left" | "right";
type EditorMode = "visual" | "html";
type ColorMode  = "text" | "highlight" | null;

export default function RichBodyEditor({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  const taRef      = useRef<HTMLTextAreaElement>(null);
  const visualRef  = useRef<HTMLDivElement>(null);
  const imgFileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const lastSynced = useRef(value);

  const [editorMode, setEditorMode] = useState<EditorMode>("visual");

  // Image insert panel
  const [imgPanel, setImgPanel]           = useState(false);
  const [imgMode, setImgMode]             = useState<"url"|"upload">("url");
  const [imgUrl, setImgUrl]               = useState("");
  const [imgAlt, setImgAlt]               = useState("");
  const [imgAlign, setImgAlign]           = useState<ImgAlign>("center");
  const [imgUploading, setImgUploading]   = useState(false);
  const [imgUploadErr, setImgUploadErr]   = useState("");
  const [imgPixelWidth, setImgPixelWidth] = useState(600);

  // Text selection bubble
  const [textBubble, setTextBubble]             = useState<{x:number;y:number}|null>(null);
  const [bubbleBlock, setBubbleBlock]           = useState("Normal");
  const [bubbleBlockOpen, setBubbleBlockOpen]   = useState(false);
  const [bubbleSizeOpen, setBubbleSizeOpen]     = useState(false);
  const [bubbleColorMode, setBubbleColorMode]   = useState<ColorMode>(null);

  // Image bubble
  const [imgBubble, setImgBubble]               = useState<{x:number;y:number;el:HTMLImageElement}|null>(null);
  const [imgBubbleSizeOpen, setImgBubbleSizeOpen] = useState(false);

  // Toolbar color pickers + last-used colors
  const [toolbarColorMode, setToolbarColorMode] = useState<ColorMode>(null);
  const [activeTextColor, setActiveTextColor]   = useState("#0F172A");
  const [activeHighlight, setActiveHighlight]   = useState("#FEF08A");

  // ── ResizeObserver for image preview ────────────────────────────────────────
  useEffect(() => {
    const el = previewRef.current; if (!el || !imgUrl) return;
    const ro = new ResizeObserver(e => { const w=e[0]?.contentRect.width; if(w&&w>0) setImgPixelWidth(Math.round(w)); });
    ro.observe(el); return () => ro.disconnect();
  }, [imgUrl]);

  // ── Init / sync visual editor ───────────────────────────────────────────────
  useEffect(() => {
    if (editorMode !== "visual") return;
    const el = visualRef.current; if (!el) return;
    el.innerHTML = value; lastSynced.current = value;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode]);

  useEffect(() => {
    if (editorMode !== "visual") return;
    const el = visualRef.current;
    if (!el || value === lastSynced.current) return;
    el.innerHTML = value; lastSynced.current = value;
  }, [value, editorMode]);

  // ── Text selection → show bubble ─────────────────────────────────────────────
  useEffect(() => {
    if (editorMode !== "visual") { setTextBubble(null); setImgBubble(null); return; }
    const onMouseUp = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) { setTextBubble(null); return; }
        if (!visualRef.current?.contains(sel.anchorNode)) { setTextBubble(null); return; }
        // detect current block type
        let node: Node|null = sel.anchorNode;
        let blockLabel = "Normal";
        while (node && node !== visualRef.current) {
          if (node.nodeType === 1) {
            const tag = (node as Element).tagName.toLowerCase();
            const found = BLOCK_TYPES.find(b => b.tag === tag);
            if (found) { blockLabel = found.label; break; }
          }
          node = node.parentNode;
        }
        setBubbleBlock(blockLabel);
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setTextBubble({ x: rect.left + rect.width / 2, y: rect.top });
        setImgBubble(null);
        setBubbleBlockOpen(false); setBubbleSizeOpen(false); setBubbleColorMode(null);
      }, 10);
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [editorMode]);

  // ── Escape closes all menus ──────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setTextBubble(null); setImgBubble(null); setImgBubbleSizeOpen(false);
      setBubbleBlockOpen(false); setBubbleSizeOpen(false); setBubbleColorMode(null);
      setToolbarColorMode(null);
    };
    window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn);
  }, []);

  // ── syncVisual ──────────────────────────────────────────────────────────────
  const syncVisual = useCallback(() => {
    const el = visualRef.current;
    if (el) { lastSynced.current = el.innerHTML; onChange(el.innerHTML); }
  }, [onChange]);

  // ── Mode switch ──────────────────────────────────────────────────────────────
  const switchMode = (mode: EditorMode) => {
    if (mode === editorMode) return;
    setTextBubble(null); setImgBubble(null);
    if (mode === "visual") {
      setEditorMode("visual");
      requestAnimationFrame(() => {
        const el = visualRef.current;
        if (el) { el.innerHTML = value; lastSynced.current = value; el.focus(); }
      });
    } else {
      setEditorMode("html");
      requestAnimationFrame(() => taRef.current?.focus());
    }
  };

  // ── Click in visual editor → image bubble or close menus ───────────────────
  const handleVisualClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.tagName === "IMG") {
      const img = t as HTMLImageElement;
      setTextBubble(null); setImgBubbleSizeOpen(false);
      requestAnimationFrame(() => {
        const rect = img.getBoundingClientRect();
        setImgBubble({ x: rect.left + rect.width / 2, y: rect.top, el: img });
      });
    } else {
      setImgBubble(null); setImgBubbleSizeOpen(false);
    }
    setToolbarColorMode(null);
  };

  // ── execCommand helpers ──────────────────────────────────────────────────────
  const execV = useCallback((cmd: string, arg?: string) => {
    visualRef.current?.focus();
    document.execCommand(cmd, false, arg);
    requestAnimationFrame(() => syncVisual());
  }, [syncVisual]);

  const insertHTML = useCallback((html: string) => {
    visualRef.current?.focus();
    document.execCommand("insertHTML", false, html);
    requestAnimationFrame(() => syncVisual());
  }, [syncVisual]);

  // ── Toolbar actions ──────────────────────────────────────────────────────────
  const applyBold       = () => editorMode==="visual" ? execV("bold")             : wrapHtml("<strong>","</strong>");
  const applyItalic     = () => editorMode==="visual" ? execV("italic")           : wrapHtml("<em>","</em>");
  const applyUnderline  = () => editorMode==="visual" ? execV("underline")        : wrapHtml("<u>","</u>");
  const applyStrike     = () => editorMode==="visual" ? execV("strikeThrough")    : wrapHtml("<s>","</s>");
  const applyCode       = () => { if(editorMode==="visual"){ const t=window.getSelection()?.toString()||"code"; insertHTML(`<code>${t}</code>`); return; } wrapHtml("<code>","</code>"); };
  const applyCodeBlock  = () => editorMode==="visual" ? insertHTML("<pre><code>code here</code></pre>") : insertBlockHtml("<pre><code>code here</code></pre>");
  const applyClear      = () => { if(editorMode==="visual") execV("removeFormat"); };
  const applyUndo       = () => execV("undo");
  const applyRedo       = () => execV("redo");
  const applyHeading    = (h: string) => editorMode==="visual" ? execV("formatBlock", h) : wrapHtml(`<${h}>`,`</${h}>`);
  const applyBullets    = () => editorMode==="visual" ? execV("insertUnorderedList") : insertBlockHtml("<ul>\n  <li>Item</li>\n</ul>");
  const applyNumbers    = () => editorMode==="visual" ? execV("insertOrderedList")   : insertBlockHtml("<ol>\n  <li>Item</li>\n</ol>");
  const applyBlockquote = () => editorMode==="visual" ? execV("formatBlock","blockquote") : wrapHtml("<blockquote>","</blockquote>");
  const applyHR         = () => editorMode==="visual" ? insertHTML("<hr/>") : insertBlockHtml("<hr />");
  const applyAlignLeft  = () => editorMode==="visual" ? execV("justifyLeft")   : wrapHtml('<div style="text-align:left">','</div>');
  const applyAlignCtr   = () => editorMode==="visual" ? execV("justifyCenter") : wrapHtml('<div style="text-align:center">','</div>');
  const applyAlignRight = () => editorMode==="visual" ? execV("justifyRight")  : wrapHtml('<div style="text-align:right">','</div>');
  const applyAlignJust  = () => editorMode==="visual" ? execV("justifyFull")   : wrapHtml('<div style="text-align:justify">','</div>');

  const applyTextColor = (color: string) => {
    setActiveTextColor(color);
    if (editorMode==="visual") execV("foreColor", color);
    setBubbleColorMode(null); setToolbarColorMode(null);
  };

  const applyHighlightColor = (color: string) => {
    if (color !== "transparent") setActiveHighlight(color);
    if (editorMode==="visual") execV("hiliteColor", color==="transparent"?"rgba(0,0,0,0)":color);
    setBubbleColorMode(null); setToolbarColorMode(null);
  };

  const applyFontSize = (val: string | null) => {
    if (editorMode !== "visual") return;
    if (!val) { execV("removeFormat"); }
    else {
      const text = window.getSelection()?.toString() || "";
      if (text) insertHTML(`<span style="font-size:${val}">${text}</span>`);
    }
    setBubbleSizeOpen(false);
  };

  const applyBlockType = (tag: string) => {
    execV("formatBlock", tag);
    const found = BLOCK_TYPES.find(b => b.tag === tag);
    if (found) setBubbleBlock(found.label);
    setBubbleBlockOpen(false);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://"); if (!url) return;
    if (editorMode==="visual") { const t=window.getSelection()?.toString()||"link text"; insertHTML(`<a href="${url}">${t}</a>`); return; }
    const ta=taRef.current; if(!ta) return;
    const ss=ta.selectionStart, se=ta.selectionEnd;
    onChange(value.slice(0,ss)+`<a href="${url}">${value.slice(ss,se)||"link text"}</a>`+value.slice(se));
  };

  const insertYT = () => {
    const input=prompt("YouTube URL or video ID:",""); if(!input) return;
    const match=input.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    const id=match?match[1]:input.trim();
    const html=`<div class="video-embed"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe></div>`;
    editorMode==="visual" ? insertHTML(html) : insertBlockHtml(html);
  };

  const insertTable = () => {
    const html=`<table>\n  <thead>\n    <tr><th>Col 1</th><th>Col 2</th><th>Col 3</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Cell</td><td>Cell</td><td>Cell</td></tr>\n  </tbody>\n</table>`;
    editorMode==="visual" ? insertHTML(html) : insertBlockHtml(html);
  };

  const insertCallout = (type: "info"|"warn") => {
    const cls = type==="info" ? "callout-info" : "callout-warn";
    const icon = type==="info" ? "ℹ" : "⚠️";
    const label = type==="info" ? "Note" : "Warning";
    insertHTML(`<div class="${cls}"><strong>${icon} ${label}:</strong> Your text here.</div>`);
  };

  // ── HTML-mode helpers ────────────────────────────────────────────────────────
  const wrapHtml = (before: string, after: string, placeholder = "text") => {
    const ta=taRef.current; if(!ta) return;
    const ss=ta.selectionStart, se=ta.selectionEnd;
    const sel=value.slice(ss,se)||placeholder;
    onChange(value.slice(0,ss)+before+sel+after+value.slice(se));
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(ss+before.length, ss+before.length+sel.length); });
  };

  const insertBlockHtml = useCallback((text: string) => {
    const ta=taRef.current; if(!ta) return;
    const ss=ta.selectionStart;
    const prefix=ss>0&&value[ss-1]!=="\n"?"\n\n":"";
    onChange(value.slice(0,ss)+prefix+text+"\n\n"+value.slice(ss));
    requestAnimationFrame(() => { ta.focus(); const p=ss+prefix.length+text.length+2; ta.setSelectionRange(p,p); });
  }, [value, onChange]);

  // ── Image insert ─────────────────────────────────────────────────────────────
  const doInsertImage = () => {
    if (!imgUrl) return;
    const w=imgPixelWidth;
    const style=
      imgAlign==="left"  ? `width:${w}px;float:left;margin:0 1.5rem 1rem 0;` :
      imgAlign==="right" ? `width:${w}px;float:right;margin:0 0 1rem 1.5rem;` :
                           `width:${w}px;display:block;margin:1rem auto;`;
    const html=`<img src="${imgUrl}" alt="${imgAlt}" style="${style}" />`;
    editorMode==="visual" ? insertHTML(html) : insertBlockHtml(html);
    setImgPanel(false); setImgUrl(""); setImgAlt(""); setImgAlign("center"); setImgUploadErr(""); setImgPixelWidth(600);
  };

  const handleImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0]; if(!file) return;
    if(file.size>5*1024*1024){ alert("Image must be under 5 MB."); return; }
    setImgUploading(true); setImgUploadErr("");
    const fd=new FormData(); fd.append("file",file);
    const res=await uploadFile(`${API_BASE_URL}/upload.php`,fd);
    setImgUploading(false);
    const url=(res.data as {url?:string})?.url;
    if(res.status==="success"&&url){ setImgUrl(url); }
    else { setImgUploadErr((res.message as string)||"Upload failed — check file type and size"); }
    if(imgFileRef.current) imgFileRef.current.value="";
  };

  // ── Image bubble helpers ─────────────────────────────────────────────────────
  const applyImgAlign = (align: "left"|"center"|"right"|"full") => {
    const el=imgBubble?.el; if(!el) return;
    const w=el.style.width&&el.style.width!=="100%"?el.style.width:"600px";
    if(align==="left")       el.style.cssText=`width:${w};float:left;margin:0 1.5rem 1rem 0;`;
    else if(align==="right") el.style.cssText=`width:${w};float:right;margin:0 0 1rem 1.5rem;`;
    else if(align==="full")  el.style.cssText=`width:100%;display:block;margin:1rem auto;`;
    else                     el.style.cssText=`width:${w};display:block;margin:1rem auto;`;
    syncVisual();
    requestAnimationFrame(() => { if(imgBubble?.el){ const r=imgBubble.el.getBoundingClientRect(); setImgBubble(p=>p?{...p,x:r.left+r.width/2,y:r.top}:null); } });
  };

  const applyImgSize = (px: number) => {
    const el=imgBubble?.el; if(!el) return;
    const isL=el.style.float==="left", isR=el.style.float==="right";
    const sw=px===0?"100%":`${px}px`;
    if(px===0)   el.style.cssText=`width:100%;display:block;margin:1rem auto;`;
    else if(isL) el.style.cssText=`width:${sw};float:left;margin:0 1.5rem 1rem 0;`;
    else if(isR) el.style.cssText=`width:${sw};float:right;margin:0 0 1rem 1.5rem;`;
    else         el.style.cssText=`width:${sw};display:block;margin:1rem auto;`;
    syncVisual(); setImgBubbleSizeOpen(false);
    requestAnimationFrame(() => { if(imgBubble?.el){ const r=imgBubble.el.getBoundingClientRect(); setImgBubble(p=>p?{...p,x:r.left+r.width/2,y:r.top}:null); } });
  };

  const getImgAlign = (): "left"|"center"|"right"|"full" => {
    const el=imgBubble?.el; if(!el) return "center";
    if(el.style.float==="left") return "left";
    if(el.style.float==="right") return "right";
    if(el.style.width==="100%") return "full";
    return "center";
  };

  const getImgSizeLabel = () => {
    const el=imgBubble?.el; if(!el) return "Size preset";
    if(el.style.width==="100%") return "Full Width (100%)";
    const px=parseInt(el.style.width);
    const p=SIZE_PRESETS.find(p=>p.px===px);
    return p?`${p.label} (${px}px)`:px?`${px}px`:"Size preset";
  };

  // ── Small toolbar button ──────────────────────────────────────────────────────
  const Btn = ({ label, title, action, active=false, cls="" }: { label:React.ReactNode; title:string; action:()=>void; active?:boolean; cls?:string }) => (
    <button type="button" title={title} onClick={action}
      className={cn("px-1.5 py-1 rounded text-[11px] leading-none transition-colors flex-shrink-0 flex items-center justify-center",
        active?"bg-brand/90 text-white":"text-slate-600 hover:bg-slate-200 hover:text-slate-900", cls)}>
      {label}
    </button>
  );
  const Sep = () => <span className="w-px h-4 bg-slate-200 mx-0.5 self-center flex-shrink-0"/>;
  const curImgAlign = getImgAlign();

  return (
    <div className="border border-slate-200 rounded-2xl overflow-visible relative">

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200 rounded-t-2xl">

        {/* Row 1 — main formatting */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 pt-2 pb-1.5">

          {/* Mode toggle */}
          <div className="flex gap-0.5 p-0.5 bg-slate-200 rounded-lg mr-1.5">
            {(["visual","html"] as EditorMode[]).map(m => (
              <button key={m} type="button" onClick={()=>switchMode(m)}
                className={cn("px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1",
                  editorMode===m?"bg-white text-brand shadow-sm":"text-slate-500 hover:text-slate-700")}>
                {m==="visual"?<><Eye className="w-3 h-3"/>Visual</>:<><Code2 className="w-3 h-3"/>HTML</>}
              </button>
            ))}
          </div>
          <Sep/>

          {/* Undo / Redo */}
          <Btn label={<Undo2 className="w-3.5 h-3.5"/>} title="Undo (Ctrl+Z)" action={applyUndo}/>
          <Btn label={<Redo2 className="w-3.5 h-3.5"/>} title="Redo (Ctrl+Y)" action={applyRedo}/>
          <Sep/>

          {/* Headings */}
          {(["h1","h2","h3","h4","h5"] as const).map(h=>(
            <Btn key={h} label={<span className="font-black text-[9px] tracking-tight">{h.toUpperCase()}</span>} title={h.toUpperCase()} action={()=>applyHeading(h)}/>
          ))}
          <Sep/>

          {/* Inline */}
          <Btn label={<strong className="text-xs">B</strong>}                title="Bold"              action={applyBold}/>
          <Btn label={<em className="text-xs">I</em>}                        title="Italic"            action={applyItalic}/>
          <Btn label={<u className="text-xs">U</u>}                          title="Underline"         action={applyUnderline}/>
          <Btn label={<s className="text-xs">S</s>}                          title="Strikethrough"     action={applyStrike}/>
          <Btn label={<span className="font-mono text-[10px]">&lt;&gt;</span>} title="Inline code"     action={applyCode}/>
          <Btn label={<span className="text-slate-400 text-xs">◇</span>}    title="Clear formatting"   action={applyClear}/>
          <Sep/>

          {/* Align */}
          <Btn label="≡L" title="Align left"   action={applyAlignLeft}  cls="font-mono text-[10px]"/>
          <Btn label="≡C" title="Align center" action={applyAlignCtr}   cls="font-mono text-[10px]"/>
          <Btn label="≡R" title="Align right"  action={applyAlignRight} cls="font-mono text-[10px]"/>
          <Btn label="≡J" title="Justify"      action={applyAlignJust}  cls="font-mono text-[10px]"/>
          <Sep/>

          {/* Text color (A) */}
          <div className="relative">
            <button type="button" title="Text color"
              onClick={()=>{setToolbarColorMode(p=>p==="text"?null:"text");}}
              className="px-1.5 py-1 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors flex flex-col items-center gap-0.5 flex-shrink-0">
              <span>A</span>
              <span className="w-4 h-[3px] rounded-full" style={{background:activeTextColor==="#FFFFFF"?"#E2E8F0":activeTextColor}}/>
            </button>
            {toolbarColorMode==="text" && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-[9999] w-40">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Text Color</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {TEXT_COLORS.map(c=>(
                    <button key={c} type="button" title={c} onClick={()=>applyTextColor(c)}
                      className="w-5 h-5 rounded-md border border-slate-200 hover:scale-110 transition-transform"
                      style={{background:c,outline:c===activeTextColor?"2px solid #7C3AED":"none",outlineOffset:"1px"}}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Highlight (H) */}
          <div className="relative">
            <button type="button" title="Highlight color"
              onClick={()=>{setToolbarColorMode(p=>p==="highlight"?null:"highlight");}}
              className="px-1.5 py-1 rounded text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors flex flex-col items-center gap-0.5 flex-shrink-0">
              <span className="px-0.5 rounded-sm" style={{background:activeHighlight}}>H</span>
              <span className="w-4 h-[3px] rounded-full" style={{background:activeHighlight}}/>
            </button>
            {toolbarColorMode==="highlight" && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-[9999] w-44">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Highlight</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {HIGHLIGHT_COLORS.map(({label,c})=>(
                    <button key={label} type="button" title={label} onClick={()=>applyHighlightColor(c)}
                      className={cn("py-1.5 rounded-lg text-[9px] font-semibold border text-center transition-all",
                        c==="transparent"?"text-slate-500 border-slate-200 hover:border-red-300":"border-slate-100 hover:scale-105")}
                      style={c!=="transparent"?{background:c,outline:c===activeHighlight?"2px solid #7C3AED":"none",outlineOffset:"1px"}:{}}>
                      {c==="transparent"?"✕ Off":label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Sep/>

          {/* Lists / Block */}
          <Btn label="•"  title="Bullet list"  action={applyBullets}    cls="text-base leading-none"/>
          <Btn label="1." title="Ordered list" action={applyNumbers}/>
          <Btn label={<span className="italic text-slate-400 text-xs">&quot;</span>} title="Blockquote" action={applyBlockquote}/>
          <Btn label={<span className="font-mono text-[10px]">pre</span>} title="Code block" action={applyCodeBlock}/>
          <Sep/>

          {/* Insert */}
          <Btn label="Img"   title="Insert image"   action={()=>{setImgPanel(p=>!p);setTextBubble(null);setImgBubble(null);}} active={imgPanel}/>
          <Btn label="Link"  title="Insert link"    action={insertLink}/>
          <Btn label="—"     title="Horizontal rule" action={applyHR} cls="text-base"/>
          <Btn label="YT"    title="Embed YouTube"  action={insertYT}/>
          <Btn label="Table" title="Insert table"   action={insertTable}/>
        </div>

        {/* Row 2 — callout blocks (matches Image #19 row 2) */}
        <div className="flex items-center gap-1.5 px-2 pb-2 border-t border-slate-200/60 pt-1.5">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mr-0.5">Blocks:</span>
          <button type="button" onClick={()=>insertCallout("info")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-100">
            <Info className="w-3 h-3"/> Info / Note
          </button>
          <button type="button" onClick={()=>insertCallout("warn")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-100">
            <Megaphone className="w-3 h-3"/> Warning / Alert
          </button>
        </div>
      </div>

      {/* ── Image Insert Panel ───────────────────────────────────────────────── */}
      {imgPanel && (
        <div className="bg-white border-b border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Insert Image</span>
            <button type="button" onClick={()=>setImgPanel(false)} className="p-0.5 rounded text-slate-400 hover:text-slate-700"><X className="w-3.5 h-3.5"/></button>
          </div>
          <div className="flex gap-0.5 p-0.5 bg-slate-100 rounded-lg w-fit">
            {(["url","upload"] as const).map(m=>(
              <button key={m} type="button" onClick={()=>{setImgMode(m);setImgUploadErr("");}}
                className={cn("px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                  imgMode===m?"bg-white text-brand shadow-sm":"text-slate-500 hover:text-slate-700")}>
                {m==="url"?"Image URL":"Upload File"}
              </button>
            ))}
          </div>
          {imgMode==="url" ? (
            <input type="text" value={imgUrl} onChange={e=>setImgUrl(e.target.value)} placeholder="https://example.com/photo.jpg"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white"/>
          ) : (
            <div className="space-y-1.5">
              <input ref={imgFileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" onChange={handleImgFile}/>
              <button type="button" disabled={imgUploading} onClick={()=>imgFileRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl px-4 py-4 text-xs font-bold text-slate-400 hover:border-brand hover:text-brand transition-all flex items-center gap-2 justify-center disabled:opacity-50">
                <Upload className="w-3.5 h-3.5"/>
                {imgUploading?"Uploading…":"Click to choose file"}
                {!imgUploading&&<span className="font-normal text-slate-300">— JPG, PNG, WebP, GIF, SVG · max 5 MB</span>}
              </button>
              {imgUrl&&!imgUploadErr&&<p className="text-[10px] text-emerald-600 font-semibold pl-1">✓ {imgUrl.split("/").pop()}</p>}
              {imgUploadErr&&<p className="text-[10px] text-red-500 font-semibold pl-1">✗ {imgUploadErr}</p>}
            </div>
          )}
          <input type="text" value={imgAlt} onChange={e=>setImgAlt(e.target.value)} placeholder="Alt text (optional — for accessibility)"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white"/>
          {imgUrl && (
            <div className="space-y-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Size Presets</p>
                <div className="flex gap-1 flex-wrap">
                  {SIZE_PRESETS.map(({label,px})=>(
                    <button key={label} type="button"
                      onClick={()=>setImgPixelWidth(px===0?1000:px)}
                      className={cn("px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all border",
                        (px===0?imgPixelWidth===1000:imgPixelWidth===px)
                          ?"bg-brand text-white border-brand"
                          :"bg-white text-slate-600 border-slate-200 hover:border-brand hover:text-brand")}>
                      {label}{px>0?` (${px}px)`:` (100%)`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Preview — <span className="text-brand">{imgPixelWidth}px wide</span></span>
                <span className="text-[9px] text-slate-400 flex items-center gap-1"><GripHorizontal className="w-3 h-3"/> drag edge to resize</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 overflow-auto">
                <div ref={previewRef} style={{width:imgPixelWidth,maxWidth:"100%",minWidth:80,resize:"horizontal",overflow:"auto"}}
                  className="rounded-lg border-2 border-dashed border-brand/30 cursor-ew-resize">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt={imgAlt} style={{width:"100%",display:"block"}}/>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Alignment</p>
                <div className="flex gap-1">
                  {(["left","center","right"] as ImgAlign[]).map(a=>(
                    <button key={a} type="button" onClick={()=>setImgAlign(a)}
                      className={cn("px-3 py-1.5 rounded-xl text-[10px] font-bold capitalize transition-all border",
                        imgAlign===a?"bg-brand text-white border-brand":"bg-white text-slate-600 border-slate-200 hover:border-brand")}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <button type="button" onClick={doInsertImage} disabled={!imgUrl}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-40">
            Insert Image ({imgPixelWidth}px)
          </button>
        </div>
      )}

      {/* ── Visual Editor ─────────────────────────────────────────────────────── */}
      {editorMode==="visual" && (
        <div ref={visualRef} contentEditable suppressContentEditableWarning
          onInput={()=>{ const el=visualRef.current; if(!el) return; lastSynced.current=el.innerHTML; onChange(el.innerHTML); }}
          onClick={handleVisualClick}
          data-placeholder="Write your content here… Use the toolbar above to format text."
          className="rich-editor w-full p-5 focus:outline-none bg-white min-h-[360px] rounded-b-2xl"
        />
      )}

      {/* ── HTML Textarea ─────────────────────────────────────────────────────── */}
      {editorMode==="html" && (
        <textarea ref={taRef} value={value} onChange={e=>onChange(e.target.value)}
          placeholder="Write HTML here…" rows={18}
          className="w-full p-4 text-sm font-mono leading-relaxed resize-y focus:outline-none bg-white placeholder:text-slate-300 min-h-[360px] rounded-b-2xl"
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TEXT SELECTION BUBBLE — light theme, Image #20 design                 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {textBubble && editorMode==="visual" && (
        <div
          style={{position:"fixed",left:textBubble.x,top:textBubble.y-58,transform:"translateX(-50%)",zIndex:9999}}
          className="flex items-center gap-0.5 bg-white rounded-xl px-2 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-slate-200"
          onMouseDown={e=>e.preventDefault()}
        >
          {/* Block type dropdown — "Normal ▾" */}
          <div className="relative">
            <button type="button" onClick={()=>{setBubbleBlockOpen(p=>!p);setBubbleSizeOpen(false);setBubbleColorMode(null);}}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap min-w-[70px] justify-between">
              {bubbleBlock} <span className="text-slate-400 text-[9px]">▾</span>
            </button>
            {bubbleBlockOpen && (
              <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1 min-w-[145px] z-50">
                {BLOCK_TYPES.map(({label,tag})=>(
                  <button key={tag} type="button" onClick={()=>applyBlockType(tag)}
                    className={cn("w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 hover:text-brand transition-colors",
                      bubbleBlock===label?"text-brand font-bold bg-brand/5":"text-slate-700")}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Size dropdown */}
          <div className="relative">
            <button type="button" onClick={()=>{setBubbleSizeOpen(p=>!p);setBubbleBlockOpen(false);setBubbleColorMode(null);}}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              Size <span className="text-slate-400 text-[9px]">▾</span>
            </button>
            {bubbleSizeOpen && (
              <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1 min-w-[130px] z-50">
                {FONT_SIZES.map(({label,val})=>(
                  <button key={label} type="button" onClick={()=>applyFontSize(val??null)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand transition-colors">
                    <span style={val?{fontSize:val}:{}}>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="w-px h-4 bg-slate-200 mx-0.5"/>

          {/* B I U S */}
          {([
            {l:<strong className="text-xs">B</strong>, t:"Bold",          fn:applyBold},
            {l:<em className="text-xs">I</em>,         t:"Italic",        fn:applyItalic},
            {l:<u className="text-xs">U</u>,           t:"Underline",     fn:applyUnderline},
            {l:<s className="text-xs">S</s>,           t:"Strikethrough", fn:applyStrike},
          ] as const).map(({l,t,fn},i)=>(
            <button key={i} type="button" title={t} onClick={fn}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors leading-none">
              {l}
            </button>
          ))}

          <span className="w-px h-4 bg-slate-200 mx-0.5"/>

          {/* A — text color */}
          <div className="relative">
            <button type="button" title="Text color"
              onClick={()=>{setBubbleColorMode(p=>p==="text"?null:"text");setBubbleBlockOpen(false);setBubbleSizeOpen(false);}}
              className="w-7 h-7 flex flex-col items-center justify-center gap-0.5 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-xs font-bold text-slate-700 leading-none">A</span>
              <span className="w-4 h-[3px] rounded-full" style={{background:activeTextColor==="#FFFFFF"?"#E2E8F0":activeTextColor}}/>
            </button>
            {bubbleColorMode==="text" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 w-40">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Text Color</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {TEXT_COLORS.map(c=>(
                    <button key={c} type="button" title={c} onClick={()=>applyTextColor(c)}
                      className="w-5 h-5 rounded-md border border-slate-200 hover:scale-110 transition-transform"
                      style={{background:c,outline:c===activeTextColor?"2px solid #7C3AED":"none",outlineOffset:"1px"}}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* H — highlight */}
          <div className="relative">
            <button type="button" title="Highlight"
              onClick={()=>{setBubbleColorMode(p=>p==="highlight"?null:"highlight");setBubbleBlockOpen(false);setBubbleSizeOpen(false);}}
              className="w-7 h-7 flex flex-col items-center justify-center gap-0.5 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-xs font-bold text-slate-700 leading-none px-0.5 rounded-sm" style={{background:activeHighlight}}>H</span>
              <span className="w-4 h-[3px] rounded-full" style={{background:activeHighlight}}/>
            </button>
            {bubbleColorMode==="highlight" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 w-44">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Highlight</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {HIGHLIGHT_COLORS.map(({label,c})=>(
                    <button key={label} type="button" title={label} onClick={()=>applyHighlightColor(c)}
                      className={cn("py-1.5 rounded-lg text-[9px] font-semibold border text-center transition-all",
                        c==="transparent"?"text-slate-500 border-slate-200 hover:border-red-300":"border-slate-100 hover:scale-105")}
                      style={c!=="transparent"?{background:c,outline:c===activeHighlight?"2px solid #7C3AED":"none",outlineOffset:"1px"}:{}}>
                      {c==="transparent"?"✕ Off":label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="w-px h-4 bg-slate-200 mx-0.5"/>

          {/* Align — left / center / right / justify */}
          {([
            {l:"≡L",t:"Align left",    fn:applyAlignLeft},
            {l:"≡C",t:"Align center",  fn:applyAlignCtr},
            {l:"≡R",t:"Align right",   fn:applyAlignRight},
            {l:"≡J",t:"Justify",       fn:applyAlignJust},
          ] as const).map(({l,t,fn},i)=>(
            <button key={i} type="button" title={t} onClick={fn}
              className="w-7 h-7 flex items-center justify-center rounded-lg font-mono text-[11px] text-slate-600 hover:bg-slate-100 transition-colors">
              {l}
            </button>
          ))}

          {/* Caret arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm pointer-events-none"/>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* IMAGE BUBBLE — light theme, Image #18 size presets                    */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {imgBubble && editorMode==="visual" && (
        <div
          data-img-bubble
          style={{position:"fixed",left:imgBubble.x,top:imgBubble.y-58,transform:"translateX(-50%)",zIndex:9999}}
          className="flex items-center gap-1 bg-white rounded-xl px-2.5 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-slate-200 text-xs whitespace-nowrap"
          onMouseDown={e=>e.preventDefault()}
        >
          {/* Alignment */}
          {(["left","center","right","full"] as const).map(a=>{
            const icons={left:"← Left",center:"↔ Center",right:"Right →",full:"⟺ Full"};
            return (
              <button key={a} type="button" onClick={()=>applyImgAlign(a)}
                className={cn("px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors",
                  curImgAlign===a?"bg-brand text-white":"text-slate-600 hover:bg-slate-100")}>
                {icons[a]}
              </button>
            );
          })}

          <span className="w-px h-4 bg-slate-200"/>

          {/* Size preset dropdown — matches Image #18 exactly */}
          <div className="relative">
            <button type="button" onClick={()=>setImgBubbleSizeOpen(p=>!p)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
              {getImgSizeLabel()} <span className="text-slate-400 text-[9px]">▾</span>
            </button>
            {imgBubbleSizeOpen && (
              <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden min-w-[180px]">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Size preset
                </div>
                {SIZE_PRESETS.map(({label,px})=>(
                  <button key={label} type="button" onClick={()=>applyImgSize(px)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-brand/5 hover:text-brand transition-colors font-medium border-b border-slate-50 last:border-0">
                    {label}{px>0?` (${px}px)`:` (100%)`}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="w-px h-4 bg-slate-200"/>

          {/* Alt display */}
          {imgBubble.el.alt && (
            <span className="text-[10px] text-slate-400 max-w-[100px] truncate">
              &quot;{imgBubble.el.alt}&quot;
            </span>
          )}

          {/* Rename alt */}
          <button type="button" title="Edit alt text"
            onClick={()=>{ const el=imgBubble.el; const a=prompt("Alt text:",el.alt??""); if(a===null) return; el.alt=a; syncVisual(); setImgBubble(p=>p?{...p}:null); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
            <Pencil className="w-3 h-3"/> Alt
          </button>

          {/* Delete */}
          <button type="button" title="Delete image"
            onClick={()=>{ imgBubble.el.remove(); setImgBubble(null); syncVisual(); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3 h-3"/> Delete
          </button>

          {/* Caret arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm pointer-events-none"/>
        </div>
      )}
    </div>
  );
}
