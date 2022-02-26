import React from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';

import createEmotionCache from '../utility/createEmotionCache';
import lightTheme from '../styles/theme/lightTheme';
import '../styles/globals.css';
import { AppProps } from 'next/app';
import ToastContext, { ToastContextProps } from '../contexts/ToastContext';
import CustomToast from '../components/CustomToast';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps{
  emotionCache: EmotionCache;
}

/** See: https://dev.to/hajhosein/nextjs-mui-v5-tutorial-2k35 */
const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [successOpen, setSuccessOpen] = React.useState<boolean>(false);
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const [errorOpen, setErrorOpen] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    // Handlers
    const handleSuccessclose = ()=>{
        setSuccessOpen(false);
    }
    const handleErrorclose = ()=>{
        setErrorOpen(false);
    }

    // Context values
    const toastValue: ToastContextProps = {
        openSuccess: (message)=>{
            setSuccessMessage(message);
            setSuccessOpen(true);
        },

        openError: (message)=>{
            setErrorMessage(message);
            setErrorOpen(true);
        },
    }

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <CustomToast
            successOpen={successOpen} successMessage={successMessage} onSuccessClose={handleSuccessclose}
            errOpen={errorOpen} errMessage={errorMessage} onErrClose={handleErrorclose}
        />
        <ToastContext.Provider value={toastValue}>
          <Component {...pageProps} />
        </ToastContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;