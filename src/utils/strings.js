const LocalizedStrings = {
    en: { // English
        
    },
    gn: { //
      LoginEmail: 'Email/Username',
      LoginPassword: 'Passwort',
      LoginForgotPassword:'Passwort/Email vergessen',
      LoginCta:'ANMELDEN',
      ProfileScreenTitle:'PROFIL BEARBEITEN',
      ProfileScreenSelect:'Stadt auswählen',
      ProfileScreenEmail: 'E-Mail Adresse',
      ProfileScreenNumber: 'Handynummer',
      ProfileScreenUserName:'Vor- und Nachname',
      ProfileScreenCta:'SPEICHERN',
    },
  };
  
  const setLanguage = function (languageCode) {
    return LocalizedStrings[languageCode];
  };
  
  export const strings = setLanguage('gn');
  