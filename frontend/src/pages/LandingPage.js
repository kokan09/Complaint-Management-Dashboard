import React, { useEffect } from 'react';
import "./LandingPage.css";
import { useState } from 'react';

function LandingPage({ onNavigate }) {
  const [innerDisplay, setinnerDisplay] = useState(true);
  const [description, setdescription] = useState("AI-powered platform to centralize, analyze, and resolve customer complaints efficiently");

  useEffect(function(){
    if(innerDisplay === false){
      let int = setInterval(Matrix, 50);
      setTimeout(function(){
        clearInterval(int);
      },10200)
    }
  },[innerDisplay])

  let iteration = 0;

  function Matrix(){
    const letters = [
      'A','B','C','D','E','F','G','H','I','J','K','L','M',
      'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
      'a','b','c','d','e','f','g','h','i','j','k','l','m',
      'n','o','p','q','r','s','t','u','v','w','x','y','z'
    ];


    let desc = description.split("").map(function(char, idx){
      if(iteration >= idx) return char;

      return letters[Math.floor(Math.random() * 52)]
    }).join("");

    setdescription(desc);

    iteration += 0.5;
  }


  return (
    <div className="landing-page" 
    onMouseMove={(dets) => {
      document.documentElement.style.setProperty("--x", dets.clientX+"px");
      document.documentElement.style.setProperty("--y", dets.clientY+"px");
    }}
    onClick={() =>setinnerDisplay(prev => false)}
    > 
      <div className='InOne'>
        <div className="landing-hero">
          <h1>Unified Customer <span>Complaint</span> Management</h1>
          <p>{description}</p>
          <div className="landing-buttons">
            <button className="btn-primary" onClick={() => onNavigate('signin')}>Sign In</button>
            <button className="btn-secondary" onClick={() => onNavigate('signup')}>Sign Up</button>
          </div>
        </div>

        <div className='AI-Model'>
          <p>Hello</p>
          
          
        </div>
      </div>

      <div className="landing-features">
        <div className="feature-card">
          <h3>🤖 AI-Powered Analysis</h3>
          <p>Automatic categorization and sentiment analysis</p>
        </div>
        <div className="feature-card">
          <h3>📊 Real-time Analytics</h3>
          <p>Track trends and performance metrics</p>
        </div>
        <div className="feature-card">
          <h3>⚡ SLA Management</h3>
          <p>Automated escalation and deadline tracking</p>
        </div>
        <div className="feature-card">
          <h3>🔄 Multi-Channel Support</h3>
          <p>Email, chat, social media, and more</p>
        </div>
      </div>

      <div className={innerDisplay ? "inner" : "innerdisable"}></div>
    </div>
  );
}

export default LandingPage;
