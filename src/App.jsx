import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NightField } from './components/NightField';
import { Dossier } from './components/Dossier';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { PipelineSection } from './components/PipelineSection';
import { OpportunitySection } from './components/OpportunitySection';
import { FeaturesSection } from './components/FeaturesSection';
import { GlobeSection } from './components/GlobeSection';
import { EarlyAccess } from './components/EarlyAccess';
import { Footer } from './components/Footer';
import { trackEvent } from './utils/analytics';
import './styles/index.css';
import './styles/watch.css';
import './styles/watch2.css';
import './styles/field.css';
import './styles/field2.css';
import './styles/editorial.css';
import './styles/editorial2.css';
import './styles/editorial3.css';
import './styles/editorial4.css';
import './styles/editorial5.css';
import './styles/editorial6.css';
import './styles/editorial7.css';
import './styles/behavioral.css';

export function App() {
  useEffect(() => {
    trackEvent('page_view', {
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      viewport_width: typeof window !== 'undefined' ? window.innerWidth : 0
    });
  }, []);

  return (
    <div className="app-root">
      <Navbar />
      <main id="main-content">
        <NightField />
        <Dossier />
        <Hero />
        <ProblemSection />
        <PipelineSection />
        <OpportunitySection />
        <FeaturesSection />
        <GlobeSection />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}

export default App;

