import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import './App.css';
import { GlobalStateProvider } from "./globalState";
import UploadPage from './subPages/UploadPage'
import IntroductionPage from './subPages/IntroductionPage'
import VisualizationPage from './subPages/VisualizationPage'
import MachineLearnPage from './subPages/MachineLearnPage'
import LearningResultPage from './subPages/LearningResultPage'
import { init as ConsoleBan } from 'console-ban'
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '30px auto',
    width: '90vw',
    backgroundImage: 'linear-gradient(to bottom, #5b61e5 0%, #e9c1db 49%, #ffe8c9 100%)'
    // backgroundImage: 'linear-gradient(-225deg, #7085B6 0%, #87A7D9 50%, #DEF3F8 100%)'
  },
}));
function App() {
  const classes = useStyles();
  React.useEffect(()=>{
    ConsoleBan({
      redirect: 'https://github.com/GiorgioPeng'
    })
  })
  return (
    <GlobalStateProvider>
      <Paper className={classes.root}>
        <IntroductionPage />
        <UploadPage />
        <VisualizationPage />
        <MachineLearnPage />
        <LearningResultPage />
      </Paper>
    </GlobalStateProvider>
  );
}

export default App;
