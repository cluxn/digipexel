import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'local-db.json');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getDb(): Record<string, any> {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); }
  catch { return {}; }
}

function saveDb(db: Record<string, any>) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function ok(data: unknown = null, message?: string) {
  const body: Record<string, unknown> = { status: 'success' };
  if (data !== null && data !== undefined) body.data = data;
  if (message) body.message = message;
  return NextResponse.json(body, { headers: CORS });
}

function err(message: string) {
  return NextResponse.json({ status: 'error', message }, { headers: CORS });
}

function nextId(arr: any[]): number {
  return arr.length > 0 ? Math.max(...arr.map((i: any) => Number(i.id) || 0)) + 1 : 1;
}

function slug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await context.params;
  const endpoint = slugParts[slugParts.length - 1].replace('.php', '');
  const sp = new URL(req.url).searchParams;
  const db = getDb();

  switch (endpoint) {
    case 'leads':         return ok(db.leads ?? []);
    case 'stats':         return ok({ leads: (db.leads ?? []).length, blogs: (db.blogs ?? []).length, case_studies: (db.case_studies ?? []).length, guides: (db.guides ?? []).length, testimonials: (db.testimonials ?? []).length, subscribers: (db.newsletter_subscribers ?? []).filter((s: any) => s.status === 'active').length });
    case 'logos':         return ok({ enabled: true, logos: db.logos ?? [] });
    case 'banners':       return ok(db.banners ?? {});
    case 'categories':    return ok(db.categories ?? []);
    case 'analytics':     return ok(db.analytics ?? []);
    case 'users':         return ok([]);

    case 'settings': {
      const key = sp.get('key');
      if (key) return ok({ key, value: (db.settings ?? {})[key] ?? '' });
      return ok(db.settings ?? {});
    }

    case 'testimonials': {
      const items = db.testimonials ?? [];
      if (sp.get('with_focus') === '1') return ok({ items, focus: db.testimonials_focus ?? [] });
      return ok(items);
    }

    case 'service_content': {
      const s = sp.get('slug');
      if (!s) return err('slug required');
      const data = (db.service_content ?? {})[s] ?? {};
      const sec = sp.get('section');
      return ok(sec ? (data[sec] ?? null) : data);
    }

    case 'seo_meta': {
      const page = sp.get('page') ?? '';
      return ok((db.seo_meta ?? {})[page] ?? null);
    }

    case 'site_content': {
      const sec = sp.get('section');
      if (!sec) return err('section required');
      const defaults: Record<string, unknown> = {
        problem: { stat1_value: '14 hrs', stat1_detail: 'lost per team / week', stat1_title: 'Handoff Friction', stat1_body: 'Every tool switch and status update burns hours that should go toward delivering real outcomes.', stat2_value: '6+ tools', stat2_detail: 'disconnected on average', stat2_title: 'Siloed Systems', stat2_body: "Fragmented data means your AI can't see the full picture.", stat3_value: '40%', stat3_detail: 'of all work is rework', stat3_title: 'Manual Rework', stat3_body: 'Teams spend nearly half their time re-entering or reformatting information.' },
      };
      return ok((db.site_content ?? {})[sec] ?? defaults[sec] ?? null);
    }

    case 'blogs': {
      const s = sp.get('slug');
      const isAdmin = sp.get('admin') === '1';
      const blogs = db.blogs ?? [];
      if (s) {
        const post = blogs.find((b: any) => b.slug === s);
        return post ? ok(post) : err('Not found');
      }
      const list = isAdmin ? blogs : blogs.filter((b: any) => b.status === 'published');
      return ok(list.map((b: any) => ({ ...b, tags_array: (b.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean) })));
    }

    case 'case_studies': {
      const s = sp.get('slug');
      const isAdmin = sp.get('admin') === '1';
      const items = db.case_studies ?? [];
      if (s) {
        const item = items.find((c: any) => c.slug === s);
        return item ? ok(item) : err('Not found');
      }
      return ok(isAdmin ? items : items.filter((c: any) => c.status === 'published'));
    }

    case 'guides': {
      const items = db.guides ?? [];
      const id = sp.get('id');
      const s = sp.get('slug');
      if (id) { const g = items.find((i: any) => String(i.id) === id); return g ? ok(g) : err('Not found'); }
      if (s)  { const g = items.find((i: any) => i.slug === s);        return g ? ok(g) : err('Not found'); }
      return ok(items);
    }

    case 'newsletter': {
      const subs: any[] = db.newsletter_subscribers ?? [];
      const statusFilter = sp.get('status');
      const filtered = statusFilter ? subs.filter((s: any) => s.status === statusFilter) : subs;
      return ok(filtered.sort((a: any, b: any) => new Date(b.subscribed_at).getTime() - new Date(a.subscribed_at).getTime()));
    }

    default: return err('Unknown endpoint');
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await context.params;
  const endpoint = slugParts[slugParts.length - 1].replace('.php', '');
  const db = getDb();
  let body: Record<string, any>;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }
  const action = body.action ?? '';

  switch (endpoint) {
    case 'leads': {
      const leads = db.leads ?? [];
      if (action === 'add_lead') {
        leads.push({ id: nextId(leads), full_name: body.full_name ?? '', email: body.email ?? '', company: body.company ?? '', contact_number: body.contact_number ?? '', service: body.service ?? '', message: body.message ?? '', status: 'new', created_at: new Date().toISOString() });
        db.leads = leads; saveDb(db); return ok(null, 'Lead captured');
      }
      if (action === 'update_status') {
        const i = leads.findIndex((l: any) => String(l.id) === String(body.id));
        if (i !== -1) leads[i].status = body.status;
        db.leads = leads; saveDb(db); return ok(null, 'Status updated');
      }
      if (action === 'delete_lead') { db.leads = leads.filter((l: any) => String(l.id) !== String(body.id)); saveDb(db); return ok(null, 'Deleted'); }
      return err('Unknown action');
    }

    case 'newsletter': {
      const subs: any[] = db.newsletter_subscribers ?? [];
      if (action === 'subscribe') {
        if (subs.some((s: any) => s.email === body.email)) return NextResponse.json({ status: 'error', message: 'already subscribed' }, { headers: CORS });
        subs.push({ id: nextId(subs), email: body.email, status: 'active', subscribed_at: new Date().toISOString() });
        db.newsletter_subscribers = subs; saveDb(db); return ok(null, 'Subscribed');
      }
      if (action === 'unsubscribe') {
        const i = subs.findIndex((s: any) => String(s.id) === String(body.id));
        if (i !== -1) subs[i].status = 'unsubscribed';
        db.newsletter_subscribers = subs; saveDb(db); return ok(null, 'Unsubscribed');
      }
      if (action === 'delete_subscriber') {
        db.newsletter_subscribers = subs.filter((s: any) => String(s.id) !== String(body.id));
        saveDb(db); return ok(null, 'Deleted');
      }
      return err('Unknown action');
    }

    case 'settings': {
      if (action === 'save_setting') { db.settings = { ...(db.settings ?? {}), [body.key]: body.value }; saveDb(db); return ok(null, 'Saved'); }
      if (action === 'save_all_settings') { db.settings = { ...(db.settings ?? {}), ...body.settings }; saveDb(db); return ok(null, 'All settings saved'); }
      return err('Unknown action');
    }

    case 'service_content': {
      if (action === 'save_section') {
        const { slug: s, section, content } = body;
        if (!s || !section) return err('slug and section required');
        if (!db.service_content) db.service_content = {};
        if (!db.service_content[s]) db.service_content[s] = {};
        db.service_content[s][section] = content;
        saveDb(db); return ok(null, 'Saved');
      }
      return err('Unknown action');
    }

    case 'testimonials': {
      const items: any[] = db.testimonials ?? [];
      if (action === 'save_testimonial') {
        const t = body.testimonial ?? {};
        if (t.id) { const i = items.findIndex((x: any) => String(x.id) === String(t.id)); if (i !== -1) items[i] = t; } else { t.id = nextId(items); items.push(t); }
        db.testimonials = items; saveDb(db); return ok({ id: t.id }, 'Saved');
      }
      if (action === 'delete_testimonial') { db.testimonials = items.filter((t: any) => String(t.id) !== String(body.id)); saveDb(db); return ok(null, 'Deleted'); }
      if (action === 'update_testimonials') { db.testimonials = (body.testimonials ?? []).map((t: any, i: number) => ({ ...t, id: t.id ?? i + 1, position: i })); saveDb(db); return ok(null, 'Updated'); }
      if (action === 'update_focus') { db.testimonials_focus = body.focus ?? []; saveDb(db); return ok(null, 'Focus updated'); }
      return err('Unknown action');
    }

    case 'blogs': {
      const blogs: any[] = db.blogs ?? [];
      if (action === 'save_post') {
        const b = body.post ?? {};
        const s = b.slug || slug(b.title ?? 'post');
        if (b.id) { const i = blogs.findIndex((p: any) => String(p.id) === String(b.id)); if (i !== -1) blogs[i] = { ...blogs[i], ...b, slug: s }; db.blogs = blogs; saveDb(db); return ok({ id: b.id }, 'Updated'); }
        const np = { ...b, id: nextId(blogs), slug: s, sections: b.sections ?? [], tags_array: [], status: b.status ?? 'published', created_at: new Date().toISOString(), published_at: b.published_at ?? new Date().toISOString().slice(0, 10) };
        blogs.push(np); db.blogs = blogs; saveDb(db); return ok({ id: np.id }, 'Created');
      }
      if (action === 'delete_post') { db.blogs = blogs.filter((p: any) => String(p.id) !== String(body.id)); saveDb(db); return ok(null, 'Deleted'); }
      if (action === 'update_blogs') { db.blogs = body.blogs ?? []; saveDb(db); return ok(null, 'Updated'); }
      return err('Unknown action');
    }

    case 'case_studies': {
      const items: any[] = db.case_studies ?? [];
      if (action === 'save_case') {
        const c = body.case ?? body.case_study ?? {};
        const s = c.slug || slug(c.title ?? 'case');
        if (c.id) { const i = items.findIndex((x: any) => String(x.id) === String(c.id)); if (i !== -1) items[i] = { ...items[i], ...c, slug: s }; db.case_studies = items; saveDb(db); return ok({ id: c.id }, 'Updated'); }
        const nc = { ...c, id: nextId(items), slug: s, service_tags: c.service_tags ?? [], sections: c.sections ?? [], status: c.status ?? 'published', created_at: new Date().toISOString() };
        items.push(nc); db.case_studies = items; saveDb(db); return ok({ id: nc.id }, 'Created');
      }
      if (action === 'delete_case') { db.case_studies = items.filter((x: any) => String(x.id) !== String(body.id)); saveDb(db); return ok(null, 'Deleted'); }
      if (action === 'update_cases') { db.case_studies = body.cases ?? []; saveDb(db); return ok(null, 'Updated'); }
      return err('Unknown action');
    }

    case 'guides': {
      const items: any[] = db.guides ?? [];
      if (action === 'save_guide') {
        const g = body.guide ?? {};
        if (g.id) { const i = items.findIndex((x: any) => String(x.id) === String(g.id)); if (i !== -1) items[i] = g; } else { g.id = nextId(items); items.push(g); }
        db.guides = items; saveDb(db); return ok({ id: g.id }, 'Saved');
      }
      if (action === 'delete_guide') { db.guides = items.filter((x: any) => String(x.id) !== String(body.id)); saveDb(db); return ok(null, 'Deleted'); }
      return err('Unknown action');
    }

    case 'logos': {
      if (action === 'toggle_section') { db.logos_settings = { enabled: body.enabled }; saveDb(db); return ok(null, 'Updated'); }
      if (action === 'update_logos')   { db.logos = body.logos ?? []; saveDb(db); return ok(null, 'Updated'); }
      return err('Unknown action');
    }

    case 'banners': {
      if (action === 'save_banners') { db.banners = { ...(db.banners ?? {}), ...body.configs }; saveDb(db); return ok(null, 'Saved'); }
      return err('Unknown action');
    }

    case 'seo_meta': {
      if (action === 'save_seo_meta') { if (!db.seo_meta) db.seo_meta = {}; db.seo_meta[body.page_key] = { seo_title: body.seo_title, meta_description: body.meta_description, og_image: body.og_image }; saveDb(db); return ok(null, 'Saved'); }
      return err('Unknown action');
    }

    case 'site_content': {
      if (action === 'save_section') { if (!db.site_content) db.site_content = {}; db.site_content[body.section] = body.content; saveDb(db); return ok(null, 'Saved'); }
      return err('Unknown action');
    }

    case 'categories': {
      const cats: any[] = db.categories ?? [];
      if (action === 'save_category') { const c = body.category ?? {}; if (c.id) { const i = cats.findIndex((x: any) => String(x.id) === String(c.id)); if (i !== -1) cats[i] = c; } else { c.id = nextId(cats); cats.push(c); } db.categories = cats; saveDb(db); return ok({ id: c.id }, 'Saved'); }
      if (action === 'delete_category') { db.categories = cats.filter((c: any) => String(c.id) !== String(body.id)); saveDb(db); return ok(null, 'Deleted'); }
      if (action === 'update_categories') { db.categories = body.categories ?? []; saveDb(db); return ok(null, 'Updated'); }
      return err('Unknown action');
    }

    case 'analytics':
    case 'upload':
      return ok(null, 'OK');

    default:
      return err('Unknown endpoint');
  }
}
