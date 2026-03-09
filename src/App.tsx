import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  User, 
  Briefcase, 
  Send,
  MapPin,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Project, Profile } from './types';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(setProfile);
    fetch('/api/projects').then(res => res.json()).then(setProjects);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus({ type: 'success', message: 'Message sent! I will get back to you soon.' });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: 'Failed to connect to server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tighter flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950">
              <Code2 size={20} />
            </div>
            <span>{profile.name.split(' ')[0]}<span className="text-emerald-500">.dev</span></span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['About', 'Projects', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                {item}
              </a>
            ))}
            <a 
              href="#contact" 
              className="px-5 py-2.5 bg-emerald-500 text-zinc-950 rounded-full text-sm font-semibold hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-zinc-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-zinc-950 pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {['About', 'Projects', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-semibold text-zinc-100"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]"></div>
          </div>

          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Available for projects
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Digital Experiences</span> that Matter.
              </h1>
              <p className="text-lg text-zinc-400 mb-8 max-w-lg leading-relaxed">
                I'm <a href="https://github.com/Rajkumarrautkurmi" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{profile.name}</a>, a {profile.role} specializing in building high-performance, scalable web applications with modern technologies.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://github.com/Rajkumarrautkurmi" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-emerald-500 text-zinc-950 rounded-2xl font-bold hover:bg-emerald-400 transition-all flex items-center gap-2 group">
                  View Projects
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="flex items-center gap-3">
                  <a href="https://github.com/Rajkumarrautkurmi" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                    <Github size={20} />
                  </a>
                  <a href="https://www.linkedin.com/in/raj-kumar-raut-kurmi-b2b180259" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 group">
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Experience</p>
                    <p className="text-lg font-bold">Fresher</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 bg-zinc-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <User className="text-emerald-500" />
                  About Me
                </h2>
                <div className="space-y-6 text-zinc-400 leading-relaxed">
                  <p>{profile.bio}</p>
                  <div className="grid grid-cols-2 gap-6 pt-6">
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Location</p>
                      <p className="text-zinc-200 flex items-center gap-2">
                        <MapPin size={16} className="text-emerald-500" />
                        {profile.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Email</p>
                      <p className="text-zinc-200 flex items-center gap-2">
                        <Mail size={16} className="text-emerald-500" />
                        {profile.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Languages', skills: 'C, C++, Java, Python' },
                  { label: 'Frontend', skills: 'React, Next.js, Tailwind' },
                  { label: 'Backend', skills: 'Node.js, Express' },
                  { label: 'Database', skills: 'MongoDB, SQLite, SQL' },
                  { label: 'Tools', skills: 'Git, Docker, VS Code' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-zinc-950 border border-white/5 rounded-2xl"
                  >
                    <h3 className="text-emerald-500 font-bold mb-2">{item.label}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.skills}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <Briefcase className="text-emerald-500" />
                  Featured Projects
                </h2>
                <p className="text-zinc-400 max-w-md">
                  A collection of my recent work, ranging from complex web applications to experimental prototypes.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-full bg-emerald-500 text-zinc-950 text-sm font-bold">All</button>
                <button className="px-4 py-2 rounded-full bg-white/5 text-zinc-400 text-sm font-bold hover:bg-white/10 transition-colors">Web</button>
                <button className="px-4 py-2 rounded-full bg-white/5 text-zinc-400 text-sm font-bold hover:bg-white/10 transition-colors">Mobile</button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-zinc-950 rounded-full hover:scale-110 transition-transform">
                        <Github size={20} />
                      </a>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-emerald-500 text-zinc-950 rounded-full hover:scale-110 transition-transform">
                        <ExternalLink size={20} />
                      </a>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-emerald-500 flex items-center gap-2 hover:gap-3 transition-all">
                      View Project <ChevronRight size={16} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 bg-zinc-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <Mail className="text-emerald-500" />
                  Get in Touch
                </h2>
                <p className="text-zinc-400 mb-12 leading-relaxed">
                  Have a project in mind or just want to say hi? Feel free to reach out. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Email Me</p>
                      <p className="text-lg font-semibold">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500">
                      <Linkedin size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">LinkedIn</p>
                      <a href="https://www.linkedin.com/in/raj-kumar-raut-kurmi-b2b180259" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:text-emerald-500 transition-colors">raj-kumar-raut-kurmi</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.name}
                        onChange={e => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email</label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={e => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subject</label>
                    <input 
                      type="text" 
                      value={contactForm.subject}
                      onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Project Inquiry"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Message</label>
                    <textarea 
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={e => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-emerald-500 text-zinc-950 rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        Send Message
                        <Send size={18} />
                      </>
                    )}
                  </button>

                  {submitStatus && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl text-sm font-medium ${
                        submitStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-zinc-950">
              <Code2 size={14} />
            </div>
            <span className="font-bold tracking-tighter">{profile.name.split(' ')[0]}<span className="text-emerald-500">.dev</span></span>
          </div>
          <p className="text-zinc-500 text-sm mb-8">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <a href="https://github.com/Rajkumarrautkurmi" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-500 transition-colors"><Github size={20} /></a>
            <a href="https://www.linkedin.com/in/raj-kumar-raut-kurmi-b2b180259" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-emerald-500 transition-colors"><Linkedin size={20} /></a>
            <a href={`mailto:${profile.email}`} className="text-zinc-500 hover:text-emerald-500 transition-colors"><Mail size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
