import React from "react";
import "./App.css";
import headshot from "./assets/headshot.png";
import Loader from "react-loaders";
import { AmazonLogo } from "./icons/AmazonLogo";
import { TeslaLogo } from "./icons/TeslaLogo";
import { GithubIcon } from "./icons/GithubIcon";
import { SunIcon } from "./icons/SunIcon";
import { MoonIcon } from "./icons/MoonIcon";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";
import SpotifyNowPlaying from "./components/SpotifyNowPlaying";

const Card = ({
  title,
  children,
  footerContent,
  headerPrefix,
  headerSuffix,
}: {
  title: string;
  children: React.ReactNode;
  footerContent: React.ReactNode;
  headerPrefix?: React.ReactNode;
  headerSuffix?: React.ReactNode;
}) => (
  <div className="card">
    <div>
      <div className="card-header">
        <h3>
          {headerPrefix}
          <span>{title}</span>
        </h3>
        {headerSuffix}
      </div>
      {children}
    </div>
    <div className="card-footer">{footerContent}</div>
  </div>
);

const ProjectCard = ({
  title,
  description,
  id,
  githubLink,
}: {
  title: string;
  description: string;
  id: string;
  githubLink?: string;
}) => (
  <Card
    title={title}
    footerContent={<span>ID {id}</span>}
    headerSuffix={
      githubLink ? (
        <a href={githubLink} target="_blank" rel="noopener noreferrer">
          <GithubIcon />
        </a>
      ) : null
    }
  >
    <p>{description}</p>
  </Card>
);

const ExperienceCard = ({
  title,
  company,
  years,
  logo,
  link,
  metaLeft,
}: {
  title: string;
  company: string;
  years: string;
  logo?: React.ReactNode;
  link?: string;
  metaLeft?: React.ReactNode;
}) => (
  <Card
    title={title}
    footerContent={
      <div className="card-footer-row">
        <span className="card-meta-left">{metaLeft}</span>
        <span className="card-meta-right">{years}</span>
      </div>
    }
    headerPrefix={logo}
    headerSuffix={
      link ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <ExternalLinkIcon />
        </a>
      ) : undefined
    }
  >
    <p className="card-subtitle">{company}</p>
  </Card>
);

const EducationCard = ({
  school,
  degree,
  years,
  link,
  metaLeft,
}: {
  school: string;
  degree: string;
  years: string;
  link?: string;
  metaLeft?: string;
}) => (
  <Card
    title={school}
    footerContent={
      <div className="card-footer-row">
        <span className="card-meta-left">{metaLeft}</span>
        <span className="card-meta-right">{years}</span>
      </div>
    }
    headerSuffix={
      link ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <ExternalLinkIcon />
        </a>
      ) : undefined
    }
  >
    <div className="card-header">
      <div>
        <p className="card-subtitle">{degree}</p>
      </div>
    </div>
  </Card>
);

const GameCard = ({
  game,
  currentRank,
  peakRank,
  hoursPlayed,
  link,
}: {
  game: string;
  currentRank: string;
  peakRank: string;
  hoursPlayed: number;
  link?: string;
}) => (
  <div className="card game-card">
    <div className="card-header">
      <h3>{game}</h3>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <ExternalLinkIcon />
        </a>
      )}
    </div>
    <div className="game-info">
      <div>
        <strong>Current Rank:</strong> {currentRank}
      </div>
      <div>
        <strong>Peak Rank:</strong> {peakRank}
      </div>
      <div>
        <strong>Hours Played:</strong> {hoursPlayed}
      </div>
    </div>
  </div>
);

const StatusBar = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  });

  return (
    <div className="status-bar">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.25rem",
        }}
      >
        <span>Fremont, CA</span>
        <span>{formattedTime} PST</span>
      </div>
    </div>
  );
};

function getCookie(name: string) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/";
}

function App() {
  const [isLoaderVisible, setLoaderVisible] = React.useState(true);
  const [isFadingOut, setFadingOut] = React.useState(false);
  const [theme, setTheme] = React.useState(() => getCookie("theme") || "light");

  React.useEffect(() => {
    document.body.dataset.theme = theme;
    setCookie("theme", theme);
  }, [theme]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => setLoaderVisible(false), 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme((prev: string) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      {/* Preload headshot during loader */}
      {isLoaderVisible && (
        <img
          src={headshot}
          alt=""
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      )}
      {isLoaderVisible && (
        <div className={`loader-wrapper ${isFadingOut ? "fade-out" : ""}`}>
          <Loader type="ball-pulse-sync" active />
        </div>
      )}
      {!isLoaderVisible && (
        <>
          <div className="main-container fade-in">
            <header>
              <div className="name-section">
                <img src={headshot} alt="headshot" className="headshot" />
                <div className="header-title">
                  <h1>Nicholas Channg</h1>
                  <p className="intro-text">Computer Science @ Cornell</p>
                  <p className="intro-text">Software Engineer @ Tesla</p>
                </div>
              </div>
              <nav className="header-nav">
                <div className="nav-section">
                  <a
                    href="https://www.linkedin.com/in/nicholaschanng/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/nicholaschanng"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://github.com/NicholasChanng/resume/blob/main/Nicholas_Channg_resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </a>
                </div>
              </nav>
            </header>
            <StatusBar />
            <main>
              <div className="section-divider" />
              <h2 className="section-title">Experience</h2>
              <div className="card-gallery">
                <ExperienceCard
                  title="Amazon"
                  company="Incoming SDE Intern"
                  years="Fall 2025"
                  logo={<AmazonLogo />}
                  link="https://www.amazon.com"
                  metaLeft={
                    <>
                      <a
                        href="https://advertising.amazon.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-meta-link"
                      >
                        Amazon Ads
                      </a>
                    </>
                  }
                />
                <ExperienceCard
                  title="Tesla"
                  company="Software Engineer Intern"
                  years="May 2025-Present"
                  logo={<TeslaLogo />}
                  link="https://www.tesla.com"
                  metaLeft={
                    <>
                      <a
                        href="https://www.tesla.com/AI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-meta-link"
                      >
                        AI Agent
                      </a>
                      {" + "}
                      <a
                        href="https://apps.apple.com/us/app/tesla/id582007913"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-meta-link"
                      >
                        Tesla Mobile App
                      </a>
                    </>
                  }
                />
              </div>

              <div className="section-divider" />
              <h2 className="section-title">Projects</h2>
              <div className="card-gallery project-gallery">
                <ProjectCard
                  title="nickchanng.com"
                  description="Personal Website"
                  id="008"
                  githubLink="https://github.com/NicholasChanng/nickchanng.com"
                />
                <ProjectCard
                  title="TripTune"
                  description="NLP Vacation Planner"
                  id="007"
                  githubLink="https://github.com/nfq2/4300-final-project"
                />
                <ProjectCard
                  title="ElectAI"
                  description="ML Voter Turnout Model"
                  id="006"
                  githubLink="https://github.com/NicholasChanng/ElectAI"
                />
                <ProjectCard
                  title="MathGPT"
                  description="AI Math Tutor Chrome Extension"
                  id="005"
                  githubLink="https://chromewebstore.google.com/search/mathgpt"
                />
                <ProjectCard
                  title="OCaml Casino"
                  description="CS 3110 Final Project"
                  id="004"
                  githubLink="https://github.com/NicholasChanng/cs3110-final-project"
                />
                <ProjectCard
                  title="Prakriti"
                  description="1st Place @ Cornell Digital Agriculture Hackathon"
                  id="003"
                  githubLink="https://github.com/NicholasChanng/prakriti"
                />
                <ProjectCard
                  title="Sky Taekwondo"
                  description="Storefront for Sky TKD"
                  id="002"
                  githubLink="https://github.com/NicholasChanng/sky-taekwondo-website"
                />
                <ProjectCard
                  title="vizAsianHate"
                  description="Interactivity Award & Top 12 @ Vizathon 2021"
                  id="001"
                  githubLink="https://github.com/rolandyangg/vizAsianHate"
                />
              </div>

              <div className="section-divider" />
              <h2 className="section-title">Education</h2>
              <div className="card-gallery">
                <EducationCard
                  school="Cornell University"
                  degree="B.A. Computer Science"
                  years="2023-2027"
                  link="https://www.cornell.edu"
                  // metaLeft="GPA: 3.72"
                />
                <EducationCard
                  school="Bridgewater-Raritan High School"
                  degree="High School Diploma"
                  years="2019-2023"
                  link="https://hs.brrsd.org/"
                  metaLeft="GPA: 4.7"
                />
              </div>

              <div className="section-divider" />
              <SpotifyNowPlaying />

              <div className="section-divider" />

              <h2 className="section-title">Games I Play</h2>
              <div className="card-gallery games-gallery">
                <GameCard
                  game="Valorant"
                  currentRank="Diamond 3"
                  peakRank="Immortal 3"
                  hoursPlayed={819}
                  link="https://tracker.gg/valorant/profile/riot/Flaming%230000/overview?platform=pc&playlist=competitive"
                />
                <GameCard
                  game="Fortnite"
                  currentRank="Unranked"
                  peakRank="Elite"
                  hoursPlayed={473}
                  link="https://fortnitetracker.com/profile/all/Flxming."
                />
                <GameCard
                  game="Marvel Rivals"
                  currentRank="Unranked"
                  peakRank="Platinum 1"
                  hoursPlayed={23}
                  link="https://tracker.gg/marvel-rivals/profile/ign/FlamingHogs/overview"
                />
              </div>
            </main>
            <footer className="main-footer">
              <span>&copy; {new Date().getFullYear()}</span>
              <span>made by Nick</span>
            </footer>
          </div>
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
