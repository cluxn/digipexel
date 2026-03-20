"use client";

import { N8nWorkflowBlock } from "@/components/ui/n8n-workflow-block-shadcnui";
import { motion } from "framer-motion";

export function WorkflowDemo() {
  return (
    <section
      className="relative w-full overflow-hidden pb-24"
      style={{ background: 'linear-gradient(to bottom, #080E1C 0%, #0D1428 8%, #172040 18%, #1e2a50 28%, #e8edf6 48%, #F8FAFC 60%)' }}
    >
      <div className="container mx-auto px-6 max-w-7xl pt-12">

        {/* ── Browser chrome + workflow canvas ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="rounded-2xl overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]"
          style={{ transform: 'perspective(1200px) rotateX(2deg)', transformOrigin: 'center top' }}
        >
          {/* Browser chrome bar */}
          <div className="flex items-center gap-3 px-5 py-3.5 bg-[#1a1f2e] border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 max-w-xs mx-auto">
              <div className="bg-white/5 rounded-lg px-4 py-1.5 text-[11px] text-white/25 font-mono text-center tracking-wide">
                app.digipexel.com / workflows
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10D9B0] animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#10D9B0]/70">Live</span>
            </div>
          </div>

          <N8nWorkflowBlock />
        </motion.div>

        {/* ── Caption ── */}
        <p className="text-center text-[11px] font-medium text-secondary/40 mt-6 uppercase tracking-widest">
          Live preview of a Digi Pexel AI lead pipeline — every step automated, every lead handled.
        </p>

      </div>
    </section>
  );
}
