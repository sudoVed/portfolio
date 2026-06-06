import React from "react";
import { DownloadSimple, EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playOnce, playWoosh, hoverSrc } from "../audio";
import { skills, projects } from "../data";
import { SpatialScene } from "./SpatialScene";
import { NavDot } from "./NavDot";
import { ProjectPanel } from "./ProjectPanel";

gsap.registerPlugin(ScrollTrigger);

export function Portfolio() {
  const [activeProject, setActiveProject] = React.useState(0);
  React.useLayoutEffect(() => {
    const revealContext = gsap.context(() => {
      gsap.from(".hero-copy", {
        y: 60, opacity: 0, filter: "blur(14px)",
        duration: 1.1, ease: "power4.out",
        scrollTrigger: { trigger: ".hero-copy", start: "top 88%" },
      });
      gsap.from(".profile-frame", {
        y: 40, opacity: 0, filter: "blur(8px)",
        duration: 0.9, ease: "power3.out", delay: 0.1,
        scrollTrigger: { trigger: ".profile-frame", start: "top 88%" },
      });

      gsap.utils.toArray(".section-heading").forEach((el) => {
        gsap.from(el, {
          y: 22, opacity: 0,
          duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      gsap.utils.toArray(".skill-row").forEach((el, i) => {
        gsap.from(el, {
          x: -14, opacity: 0,
          duration: 0.55, ease: "power3.out",
          delay: i * 0.09,
          scrollTrigger: { trigger: ".skill-table", start: "top 78%" },
        });
      });

      gsap.utils.toArray(".project-panel").forEach((el) => {
        gsap.from(el, {
          y: 28, opacity: 0, filter: "blur(6px)",
          duration: 0.85, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });

      gsap.from(".contact-section", {
        opacity: 0,
        duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".contact-section", start: "top 80%" },
      });

      gsap.utils.toArray(".project-panel").forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveProject(index),
          onEnterBack: () => setActiveProject(index),
        });
      });
    });

    return () => revealContext.revert();
  }, []);

  return (
    <div className="site-shell">
<SpatialScene activeProject={activeProject} />
      <nav className="side-nav" aria-label="Sections">
        {["About", "Skills", "Projects", "Contact"].map((item) => (
          <NavDot key={item} label={item} href={`#${item.toLowerCase()}`} />
        ))}
      </nav>
      <main id="content">
        <section className="hero" id="about">
          <div className="hero-inner">
            <div className="hero-copy">
              <h1 className="hero-mark">VED</h1>
              <p className="discipline">Full-Stack Developer / Robotics / Machine Learning</p>
              <p className="about-copy">
                I consider myself someone who is driven by curiosity and desire. I enjoy trying new things, building new
                things, fixing small inconveniences, and finding the small fun things in life.
              </p>
            </div>
            <figure className="profile-frame">
              <img src="/assets/profile.jpg" alt="Portrait of Vedansh Somani" />
            </figure>
          </div>
        </section>

        <section className="skills-section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading">
            <h2 id="skills-title">Capability Map</h2>
            <p>No arbitrary percentages, just the technologies, frameworks, and engineering domains I use to build real projects.</p>
          </div>
          <div className="skill-table">
            {skills.map((skill) => (
              <div className="skill-row" key={skill.group} onMouseEnter={() => playOnce(hoverSrc, 0.35)}>
                <h3>{skill.group}</h3>
                <div>
                  {skill.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="projects-section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <h2 id="projects-title">Work panels</h2>
            <p>Three of my best projects. These helped me to learn their respective skills and taught me to not leave tasks unfinished.</p>
          </div>
          <div className="project-stack">
            {projects.map((project, index) => (
              <ProjectPanel key={project.title} project={project} index={index} onActive={setActiveProject} />
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title" className="name-gradient">Vedansh Somani</h2>
          <div className="contact-links">
            <a href="/assets/resume.pdf" download="Vedansh_Somani_Resume.pdf" onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh(0.75)}>
              <DownloadSimple weight="bold" /> Resume
            </a>
            <a href="https://github.com/sudoVed" target="_blank" rel="noreferrer" onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh(0.75)}>
              <GithubLogo weight="bold" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/vedansh-somani/" target="_blank" rel="noreferrer" onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh(0.75)}>
              <LinkedinLogo weight="bold" /> LinkedIn
            </a>
            <a href="mailto:vedansh.somani.study@gmail.com" onMouseEnter={() => playOnce(hoverSrc, 0.35)} onClick={() => playWoosh(0.75)}>
              <EnvelopeSimple weight="bold" /> Email
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
