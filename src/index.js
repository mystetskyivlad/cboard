import React from 'react';
import ReactDOM from 'react-dom';
import FontFaceObserver from 'fontfaceobserver';
import 'material-components-web/dist/material-components-web.css';
import 'sanitize.css/sanitize.css';
import injectTapEventPlugin from 'react-tap-event-plugin';



import App from './containers/App';
import LanguageProvider from './containers/LanguageProvider';

// Import i18n messages
import { translationMessages, navigatorLanguage } from './i18n';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});

ReactDOM.render(
  <LanguageProvider language={navigatorLanguage} messages={translationMessages}>
    <App />
  </LanguageProvider>,
  document.getElementById('root')
);
