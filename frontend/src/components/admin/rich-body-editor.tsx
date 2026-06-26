"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Upload, X, GripHorizontal, Code2, Eye } from "lucide-react";
import { uploadFile, cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

type ImgAlign = "center" | "left" | "right";
type EditorMode = "visual" | "html";

export default function RichBodyEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const taRef       = useRef<HTMLTextAreaElement>(null);
  const visualRef   = useRef<HTMLDivElement>(null);
  const imgFileRef  = useRef<HTMLInputElement>(null);
  const previewRef  = useRef<HTMLDivElement>(null);
  // Tracks what we last wrote to the visual div — prevents cursor-reset loops
  const lastSynced  = useRef(value);

  const [editorMode, setEditorMode]         = useState<EditorMode>("visual");
  const [imgPanel, setImgPanel]             = useState(false);
  const [imgMode, setImgMode]               = useState<"url" | "upload">("url");
  const [imgUrl, setImgUrl]                 = useState("");
  const [imgAlt, setImgAlt]                 = useState("");
  const [imgAlign, setImgAlign]             = useState<ImgAlign>("center");
  const [imgUploading, setImgUploading]     = useState(false);
  const [imgUploadErr, setImgUploadErr]     = useState("");
  const [imgPixelWidth, setImgPixelWidth]   = useState(600);

  // ── Image preview ResizeObserver ────────────────────────────────────────────
  useEffect(() => {
    const el = previewRef.current;
    if (!el || !imgUrl) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setImgPixelWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [imgUrl]);

  // ── Initialise visual editor when mode switches to "visual" ─────────────────
  useEffect(() => {
    if (editorMode !== "visual") return;
    const el = visualRef.current;
    if (!el) return;
    el.innerHTML = value;
    lastSynced.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode]);

  // ── Sync value → visual editor for toolbar / parent-driven changes ──────────
  useEffect(() => {
    if (editorMode !== "visual") return;
    const el = visualRef.current;
    if (!el) return;
    // Skip if this value came from the user typing (lastSynced was already updated)
    if (value !== lastSynced.current) {
      el.innerHTML = value;
      lastSynced.current = value;
    }
  }, [value, editorMode]);

  // ── Mode switching ──────────────────────────────────────────────────────────
  const switchMode = (mode: EditorMode) => {
    if (mode === editorMode) return;
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

  // ── Visual editor input ─────────────────────────────────────────────────────
  const handleVisualInput = () => {
    const el = visualRef.current;
    if (!el) return;
    const html = el.innerHTML;
    lastSynced.current = html;
    onChange(html);
  };

  // ── execCommand wrapper for visual mode ─────────────────────────────────────
  const execVisual = useCallback((cmd: string, arg?: string) => {
    visualRef.current?.focus();
    document.execCommand(cmd, false, arg);
    requestAnimationFrame(() => {
      const el = visualRef.current;
      if (el) { lastSynced.current = el.innerHTML; onChange(el.innerHTML); }
    });
  }, [onChange]);

  // ── Insert arbitrary HTML at cursor in visual mode ──────────────────────────
  const insertVisualHTML = useCallback((html: string) => {
    visualRef.current?.focus();
    document.execCommand("insertHTML", false, html);
    requestAnimationFrame(() => {
      const el = visualRef.current;
      if (el) { lastSynced.current = el.innerHTML; onChange(el.innerHTML); }
    });
  }, [onChange]);

  // ── HTML-mode textarea helpers ───────────────────────────────────────────────
  const wrapHtml = (before: string, after: string, placeholder = "text") => {
    const ta = taRef.current; if (!ta) return;
    const ss = ta.selectionStart, se = ta.selectionEnd;
    const selected = value.slice(ss, se) || placeholder;
    const next = value.slice(0, ss) + before + selected + after + value.slice(se);
    onChange(next);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(ss + before.length, ss + before.length + selected.length); });
  };

  const insertBlockHtml = useCallback((text: string) => {
    const ta = taRef.current; if (!ta) return;
    const ss = ta.selectionStart;
    const prefix = ss > 0 && value[ss - 1] !== "\n" ? "\n\n" : "";
    const next = value.slice(0, ss) + prefix + text + "\n\n" + value.slice(ss);
    onChange(next);
    requestAnimationFrame(() => { ta.focus(); const p = ss + prefix.length + text.length + 2; ta.setSelectionRange(p, p); });
  }, [value, onChange]);

  // ── Toolbar actions (dual-mode) ─────────────────────────────────────────────
  const applyBold    = () => editorMode === "visual" ? execVisual("bold")          : wrapHtml("<strong>", "</strong>");
  const applyItalic  = () => editorMode === "visual" ? execVisual("italic")        : wrapHtml("<em>", "</em>");
  const applyHeading = (h: string) => editorMode === "visual" ? execVisual("formatBlock", h) : wrapHtml(`<${h}>`, `</${h}>`);

  const applyBullets = () => editorMode === "visual"
    ? execVisual("insertUnorderedList")
    : insertBlockHtml("<ul>\n  <li>Item one</li>\n  <li>Item two</li>\n</ul>");

  const applyNumbers = () => editorMode === "visual"
    ? execVisual("insertOrderedList")
    : insertBlockHtml("<ol>\n  <li>Item one</li>\n  <li>Item two</li>\n</ol>");

  const applyBlockquote = () => editorMode === "visual"
    ? execVisual("formatBlock", "blockquote")
    : wrapHtml("<blockquote>", "</blockquote>");

  const applyCode = () => {
    if (editorMode === "visual") {
      visualRef.current?.focus();
      const selectedText = window.getSelection()?.toString() || "code";
      document.execCommand("insertHTML", false, `<code>${selectedText}</code>`);
      requestAnimationFrame(() => {
        const el = visualRef.current;
        if (el) { lastSynced.current = el.innerHTML; onChange(el.innerHTML); }
      });
      return;
    }
    wrapHtml("<code>", "</code>");
  };

  const applyCodeBlock = () => editorMode === "visual"
    ? insertVisualHTML("<pre><code>code here</code></pre>")
    : wrapHtml("<pre><code>", "</code></pre>");

  const applyAlignLeft   = () => editorMode === "visual" ? execVisual("justifyLeft")   : wrapHtml('<div style="text-align:left">',   "</div>");
  const applyAlignCenter = () => editorMode === "visual" ? execVisual("justifyCenter") : wrapHtml('<div style="text-align:center">', "</div>");
  const applyAlignRight  = () => editorMode === "visual" ? execVisual("justifyRight")  : wrapHtml('<div style="text-align:right">',  "</div>");

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://"); if (!url) return;
    if (editorMode === "visual") {
      visualRef.current?.focus();
      const selectedText = window.getSelection()?.toString() || "link text";
      document.execCommand("insertHTML", false, `<a href="${url}">${selectedText}</a>`);
      requestAnimationFrame(() => {
        const el = visualRef.current;
        if (el) { lastSynced.current = el.innerHTML; onChange(el.innerHTML); }
      });
      return;
    }
    const ta = taRef.current; if (!ta) return;
    const ss = ta.selectionStart, se = ta.selectionEnd;
    const text = value.slice(ss, se) || "link text";
    onChange(value.slice(0, ss) + `<a href="${url}">${text}</a>` + value.slice(se));
  };

  const insertYT = () => {
    const input = prompt("YouTube URL or video ID:", ""); if (!input) return;
    const match = input.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    const id = match ? match[1] : input.trim();
    const html = `<div class="video-embed"><iframe width="100%" height="400" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe></div>`;
    editorMode === "visual" ? insertVisualHTML(html) : insertBlockHtml(html);
  };

  const insertTable = () => {
    const html = `<table>\n  <thead>\n    <tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Cell</td><td>Cell</td><td>Cell</td></tr>\n    <tr><td>Cell</td><td>Cell</td><td>Cell</td></tr>\n  </tbody>\n</table>`;
    editorMode === "visual" ? insertVisualHTML(html) : insertBlockHtml(html);
  };

  const doInsertImage = () => {
    if (!imgUrl) return;
    const w = imgPixelWidth;
    const style =
      imgAlign === "left"  ? `width:${w}px;float:left;margin:0 1.5rem 1rem 0;` :
      imgAlign === "right" ? `width:${w}px;float:right;margin:0 0 1rem 1.5rem;` :
                             `width:${w}px;display:block;margin:1rem auto;`;
    const html = `<img src="${imgUrl}" alt="${imgAlt}" style="${style}" />`;
    editorMode === "visual" ? insertVisualHTML(html) : insertBlockHtml(html);
    setImgPanel(false);
    setImgUrl(""); setImgAlt(""); setImgAlign("center"); setImgUploadErr(""); setImgPixelWidth(600);
  };

  const handleImgFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB."); return; }
    setImgUploading(true); setImgUploadErr("");
    const fd = new FormData(); fd.append("file", file);
    const res = await uploadFile(`${API_BASE_URL}/upload.php`, fd);
    setImgUploading(false);
    if (res.status === "success" && res.url) { setImgUrl(res.url as string); }
    else { setImgUploadErr((res.message as string) || "Upload failed — JPG, PNG, WebP only"); }
  };

  const Btn = ({ label, title, action, active = false, cls = "" }: { label: React.ReactNode; title: string; action: () => void; active?: boolean; cls?: string }) => (
    <button type="button" title={title} onClick={action}
      className={cn("px-1.5 py-1 rounded text-xs leading-none transition-colors", active ? "bg-brand/90 text-white" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900", cls)}>
      {label}
    </button>
  );
  const Sep = () => <span className="w-px h-4 bg-slate-200 mx-0.5 self-center flex-shrink-0" />;

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-slate-50 border-b border-slate-200">

        {/* Visual / HTML mode toggle */}
        <div className="flex gap-0.5 p-0.5 bg-slate-200 rounded-lg mr-1.5">
          <button type="button" onClick={() => switchMode("visual")}
            className={cn("px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1",
              editorMode === "visual" ? "bg-white text-brand shadow-sm" : "text-slate-500 hover:text-slate-700")}>
            <Eye className="w-3 h-3" /> Visual
          </button>
          <button type="button" onClick={() => switchMode("html")}
            className={cn("px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1",
              editorMode === "html" ? "bg-white text-brand shadow-sm" : "text-slate-500 hover:text-slate-700")}>
            <Code2 className="w-3 h-3" /> HTML
          </button>
        </div>
        <Sep />

        <Btn label={<strong>B</strong>} title="Bold"   action={applyBold} />
        <Btn label={<em>I</em>}         title="Italic" action={applyItalic} />
        <Sep />
        {(["h1","h2","h3","h4","h5","h6"] as const).map(h => (
          <Btn key={h} label={h.toUpperCase()} title={h.toUpperCase()} action={() => applyHeading(h)} />
        ))}
        <Sep />
        <Btn label="•"  title="Bullet list"   action={applyBullets} cls="text-base leading-none" />
        <Btn label="1." title="Numbered list"  action={applyNumbers} />
        <Btn label={<span className="italic text-slate-500">&quot;</span>} title="Blockquote" action={applyBlockquote} />
        <Btn label={<span className="font-mono text-[10px] tracking-tighter">&#39;abc&#39;</span>} title="Inline code" action={applyCode} />
        <Btn label="Block" title="Code block" action={applyCodeBlock} />
        <Sep />
        <Btn label="Link"  title="Insert link"   action={insertLink} />
        <Btn label="Img"   title="Insert image"  action={() => setImgPanel(p => !p)} active={imgPanel} />
        <Btn label="YT"    title="Embed YouTube" action={insertYT} />
        <Sep />
        <Btn label={<span className="text-[11px]">&#8678;</span>} title="Align left"   action={applyAlignLeft} />
        <Btn label={<span className="text-[11px]">&#8801;</span>} title="Align center" action={applyAlignCenter} />
        <Btn label={<span className="text-[11px]">&#8680;</span>} title="Align right"  action={applyAlignRight} />
        <Sep />
        <Btn label="Table" title="Insert table" action={insertTable} />
      </div>

      {/* ── Image Insert Panel ───────────────────────────────────────────────── */}
      {imgPanel && (
        <div className="bg-white border-b border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Insert Image</span>
            <button type="button" onClick={() => setImgPanel(false)} className="p-0.5 rounded text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-0.5 p-0.5 bg-slate-100 rounded-lg w-fit">
            {(["url","upload"] as const).map(m => (
              <button key={m} type="button" onClick={() => setImgMode(m)}
                className={cn("px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all", imgMode === m ? "bg-white text-brand shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                {m === "url" ? "Image URL" : "Upload File"}
              </button>
            ))}
          </div>

          {imgMode === "url" ? (
            <input type="text" value={imgUrl} onChange={e => setImgUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white" />
          ) : (
            <div className="space-y-1.5">
              <input ref={imgFileRef} type="file" accept="image/*" className="hidden" onChange={handleImgFile} />
              <button type="button" disabled={imgUploading} onClick={() => imgFileRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-400 hover:border-brand hover:text-brand transition-all flex items-center gap-2 justify-center disabled:opacity-50">
                <Upload className="w-3.5 h-3.5" />
                {imgUploading ? "Uploading…" : "Click to choose file from device"}
                {!imgUploading && <span className="font-normal text-slate-300">— JPG, PNG, WebP, max 5 MB</span>}
              </button>
              {imgUrl && <p className="text-[10px] text-emerald-600 font-semibold pl-1">✓ {imgUrl.split("/").pop()}</p>}
              {imgUploadErr && <p className="text-[10px] text-red-500 font-semibold pl-1">✗ {imgUploadErr}</p>}
            </div>
          )}

          <input type="text" value={imgAlt} onChange={e => setImgAlt(e.target.value)}
            placeholder="Alt text (optional — for accessibility)"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white" />

          {/* Resizable image preview */}
          {imgUrl && (
            <div className="space-y-1.5">
              {/* Preset size buttons */}
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Preset Sizes</span>
                <div className="flex gap-1 flex-wrap">
                  {([
                    { label: "XS",   px: 200,  desc: "200px" },
                    { label: "S",    px: 300,  desc: "300px" },
                    { label: "M",    px: 500,  desc: "500px" },
                    { label: "L",    px: 700,  desc: "700px" },
                    { label: "Full", px: 1000, desc: "1000px" },
                  ] as const).map(({ label, px, desc }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setImgPixelWidth(px)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border",
                        imgPixelWidth === px
                          ? "bg-brand text-white border-brand"
                          : "bg-white text-slate-600 border-slate-200 hover:border-brand hover:text-brand"
                      )}
                    >
                      {label}
                      <span className="ml-1 text-[9px] opacity-60">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Size Preview — <span className="text-brand font-black">{imgPixelWidth}px wide</span>
                </span>
                <span className="text-[9px] text-slate-400 flex items-center gap-1">
                  <GripHorizontal className="w-3 h-3" /> drag corner to fine-tune
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100" style={{ overflow: "auto" }}>
                <div
                  ref={previewRef}
                  style={{
                    width: imgPixelWidth,
                    maxWidth: "100%",
                    minWidth: 80,
                    resize: "horizontal",
                    overflow: "auto",
                    position: "relative",
                  }}
                  className="rounded-lg border-2 border-dashed border-brand/30 cursor-ew-resize"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt={imgAlt} style={{ width: "100%", display: "block" }} />
                  <div className="absolute bottom-0 right-0 w-5 h-5 flex items-end justify-end pb-0.5 pr-0.5 pointer-events-none">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M9 1L1 9M9 5L5 9M9 9H9" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <p className="text-[9px] text-slate-400">
                Drag the <span className="font-bold text-slate-500">right edge</span> of the image to set the width, then click Insert.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Alignment</span>
            <div className="flex gap-1">
              {(["left","center","right"] as ImgAlign[]).map(a => (
                <button key={a} type="button" onClick={() => setImgAlign(a)}
                  className={cn("px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border capitalize", imgAlign === a ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200 hover:border-brand")}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button type="button" onClick={doInsertImage} disabled={!imgUrl}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Insert Image ({imgPixelWidth}px)
          </button>
        </div>
      )}

      {/* ── Visual Editor (WYSIWYG contentEditable) ──────────────────────────── */}
      {editorMode === "visual" && (
        <div
          ref={visualRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleVisualInput}
          data-placeholder="Write your content here… Use the toolbar above to format text."
          className="rich-editor w-full p-5 focus:outline-none bg-white min-h-[300px]"
        />
      )}

      {/* ── HTML Textarea ────────────────────────────────────────────────────── */}
      {editorMode === "html" && (
        <textarea
          ref={taRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Write your content here… HTML mode."
          rows={18}
          className="w-full p-4 text-sm font-mono leading-relaxed resize-y focus:outline-none bg-white placeholder:text-slate-300 min-h-[300px]"
        />
      )}
    </div>
  );
}
