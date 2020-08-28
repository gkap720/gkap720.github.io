import React from 'react';
import p5 from 'p5';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";
import {HashLink as Link} from 'react-router-hash-link';
import './css/App.css';
import './css/detail.css';
import './css/cv.css';
import './css/about.css';
import {pages} from "./pages.json";
import CV from "./cv.json";
import Skills from "./skills.json";
import MainSketch from "./burst.js";

const Navbar = (props) => {
  return (
    <nav class="navbar">
      <div class="collapse navbar-collapse">
        <div class="link-list">
          <div class="page-link"><Link id="about" to="/">About</Link></div>
          <div class="page-link"><Link smooth id="code" to="/#projects">Code</Link></div>
          <div class="page-link"><Link id="works-link" to="/works">Art</Link></div>
          <div class="page-link"><Link id="cv" to="/cv">CV</Link></div>
        </div>
      </div>
    </nav>
  )
}

class About extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fillPage(1000);
  }
  render() {
    return (
      <div id="about-section">
        <div id="about-me" className="section">
          <img src="https://s3.amazonaws.com/gkappes/images/greg_kappes.png" />
          <div className="about-text">
            <div className="tag-wrapper">
              <div className="tagline">
                I'm a Fullstack Web Developer, Musician and Media Artist, especially passionate about crafting <span className="emphasis">interactive</span> & <span className="emphasis">accessible</span> user experiences. With a wide range of diverse experience from music-making to multimedia installation to Saas product design and implementation, I bring a unique skillset to every project.
              </div>
              <div className="disclaimer">
                [This page is for my dev work, click over <Link className="inline-link" to="/works">here</Link> for the stuff that doesn't make me any money🙃]
              </div>
            </div>
          </div>
        </div>
        <div id="experience" className="section">
          <h2 className="center-header">Experience</h2>
          <div className="skill-list">
            <div className="skill-column">
              {
                Skills.skills.slice(0, Math.ceil(Skills.skills.length/2)).map((skill) => <SkillRow skill={skill}/>)
              }
            </div>
            <div className="skill-column">
              {
                Skills.skills.slice(Math.ceil(Skills.skills.length/2)).map((skill) => <SkillRow skill={skill}/>)
              }
            </div>
          </div>
        </div>
        <div id="projects" className="section">
          <h2 className="center-header">Projects</h2>
        </div>
      </div>
    )
  }
}

const SkillRow = (props) => {
  let level = new Array(5).fill(0).fill(1, 0, props.skill.level);
  return (
    <div className="skill-row">
      <div className="skill-name">{props.skill.name}</div>
      <div className="skill-level">
        <MaskedHearts level={props.skill.level} />
      </div>
      
    </div>
  )
}
const MaskedHearts = (props) => {
  let level = new Array(5).fill(0).fill(1, 0, props.level);
  return (
      <svg viewBox="0 0 58 10" width="100%" height="100%">
        <defs>  
             <linearGradient id="gradient">  
               <stop offset="0" stop-color="dodgerblue" />  
               <stop offset="0.9" stop-color="red" />  
             </linearGradient>
             <mask id={`gradient-mask-${props.level}`}>  
              {
              level.map((level, i) => {
                  return (
                    level ? <path d={`M ${i*12+5} 9 l 4 -4 l 0 -1 l -2 -2 l -1 0 l -1 1 l -1 -1 l -1 0 l -2 2 l 0 1 l 4 4 Z`} fill="white" id={"mask-" + i} transform-origin={`${i*12+5}px 5px`} /> : ""
                    )
                 })
              }
             </mask>  
        </defs>
          <rect x="0" y="0" fill="url(#gradient)" width="58px" height="100%" mask={`url(#gradient-mask-${props.level})`} />  
          {
            level.map((level, i) => {
                return (
                  <path d={`M ${i*12+5} 9 l 4 -4 l 0 -1 l -2 -2 l -1 0 l -1 1 l -1 -1 l -1 0 l -2 2 l 0 1 l 4 4 Z`} stroke="white" fill="none" stroke-width="0.5px"/>
                )
            })
          }
        </svg>
  )
}

const Works = (props) => {
  let sorted = pages.sort((a,b) => b.year - a.year).sort((a, b) => a.importance - b.importance);
  let match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:pageName`}>
        <WorkDetail />
      </Route>
      <Route path={match.path}>
        <div id="works" class="grid">
          <div class="wrapper">
            {sorted.map((el) => <ProjectTile page={el} addToQueue={props.addToQueue} />)}
          </div>
        </div>
      </Route>
    </Switch>
  )
}

const ProjectTile = (props) => {
  return (
    <div class="project">
        <Link to={"/works/" + props.page.slug}>
          <img src={ props.page.thumbnail } class="img-responsive" burst={ props.page.color } onMouseEnter={props.addToQueue} />
          <div class="title">
              { props.page.name + ", " + props.page.year}
          </div>
        </Link>
    </div>
  )
} 

const WorkDetail = (props) => {
  let { pageName } = useParams();
  let page = pages.find((el) => el.slug == pageName);
  return (
    <div id="detail">
      <div class="name">{ page.name }</div>
      <div class="row info">
          { page.video != undefined &&
          <div class="col-lg-8 doc">
              <div class="video-container">
                  <iframe width="960" height="540" frameborder="0" allowfullscreen
                      src={ page.video }>
                  </iframe>
              </div>
          </div>
          }
          { page.sound != undefined &&
          <div class="col-lg-8 doc">
              <iframe width="100%" height="120" scrolling="no" frameborder="no" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${page.sound}&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true`}></iframe>
          </div>
          }
          { page.profile != undefined &&
          <div class="col-lg-8 doc">
              <img src={page.profile} class="img-responsive" id="gif" />
          </div>
          }
          <div class={page.video || page.sound || page.profile ? "col-md-4" : "col-md-12"} id="text">
              { page.description }
          </div>
      </div>
      { page.images.length > 1 &&
      <div>
        <hr/>
        <div class="grid">
            <div class="row">
                { page.images.map(function(image) { 
                    return (
                      <div class="gallery">
                        <a href={`/images/${image}`}><img src={`/images/${image}`} class="img-responsive" /></a>
                      </div>
                    )
                  })
                }
            </div>
        </div>
      </div>
      }
    </div>
  )
}

const CVPage = (props) => {
  let exhibitions = CV.art.exhibitions.sort((a,b) => b.year - a.year);
  let performances = CV.art.performances.sort((a,b) => b.year - a.year);
  let residencies = CV.art.residencies.sort((a,b) => b.year - a.year);
  let awards = CV.art.awards.sort((a,b) => b.year - a.year);
  let publications = CV.art.publications.sort((a,b) => b.year - a.year);
  return (
    <div id="cv-page">
      <div class="art-section">
        <CVSection items={exhibitions} title="Selected Exhibitions" display={ArtItem} />
        <CVSection items={performances} title="Selected Performances" display={ArtItem} />
        <CVSection items={residencies} title="Artists' Residencies" display={SimpleItem} />
        <CVSection items={awards} title="Awards and Workshops" display={SimpleItem} />
      </div>
      <div>
        <CVSection items={CV.education} title="Education" display={EducationItem} />
        <CVSection items={CV.teaching} title="Teaching Experience" display={TeachingItem} />
        <CVSection items={publications} title="Publications" display={SimpleItem} />
      </div>
    </div>
  )
}

const CVSection = (props) => {
  return (
    <div className="cv-section">
      <h2 class="header">{props.title}</h2>
      {props.items[0].year ?
        [...new Set(props.items.map(item => item.year))].map((year) => {
          return (
            <div>
              <h2 className="year">{year}</h2>
              <ul>
              {props.items.filter(el => el.year == year).map(props.display)}
              </ul>
            </div>
          )
        })
        : <div>
        {
          props.items.map(props.display)
        }
        </div>
      }
    </div>
  ) 
}

const ArtItem = (el) => {
  return (
    <li><span className="work-title">{el.work}</span>{el.work ? " at " : ""}{el.event}</li>
  )
}

const SimpleItem = (el) => {
  return (
    <li>{el.name}</li>
  )
}

const EducationItem = (el) => {
  return (
    <div className="education-item">
      <div className="time-range">{el.time}</div>
      <div className="degree">{el.degree}</div>
    </div>
  )
}

const TeachingItem = (el) => {
  return (
    <div className="teaching-item">
      <div className="time-range">{el.time}</div>
      <div className="teaching-position">{el.position} at {el.place}</div>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.movingText = React.createRef();
    this.scrolling = false;
    this.drawQueue = [];
    this.addToQueue = this.addToQueue.bind(this);
    this.fillPage = this.fillPage.bind(this);
    setInterval(function() {
        this.toggleClass(this.movingText.current, "shift");
    }.bind(this), 1000);
    setInterval(function() {
        this.toggleClass(this.movingText.current, "center");
    }.bind(this), 1400);
    setInterval(function() {
        this.toggleClass(this.movingText.current, "right");
    }.bind(this), 1600);
  }
  componentDidMount() {
    let sketch = new p5(MainSketch(this));
  }
  toggleClass(el, className) {
    if(!el) {
      return;
    }
    if(el.classList.contains(className)) {
      el.classList.remove(className)
    } else {
      el.classList.add(className);
    }
  }

  addToQueue(e) {
    this.drawQueue.push({"elt": e.target, "type": "burst"});
  }

  fillPage(initDelay) {
    for(let i = 0; i < 8; i++) {
      setTimeout(() => this.drawQueue.push({"type": "init"}), i*150+initDelay);
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <h1><Link to="/">Greg Kappes</Link></h1>
          <h1 id="refresh" style={{"display": "none"}}>feel free to refresh the page........ ;)</h1>
          <h2 id="description" ref={this.movingText}>
            &%/+@#^Media_Artist\\\Improvisor///Creative_Coder-$^*/~!
          </h2>
          <Navbar />
          <div className="page-container">
            <Switch>
              <Route path="/works">
                <Works addToQueue={this.addToQueue} />
              </Route>
              <Route path="/cv">
                <CVPage />
              </Route>
              <Route path="/">
                <About fillPage={this.fillPage} />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
