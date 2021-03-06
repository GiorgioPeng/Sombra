import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import { withStyles } from '@material-ui/core/styles';
import CreateChooseBar from '../utils/createChooseBar'
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import HelpIcon from '@material-ui/icons/Help';
import Fade from '@material-ui/core/Fade';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { trainComplexModel, trainSimpleModel } from '../utils/machineLearn'

const useStyles = makeStyles({
    root: {
        marginTop: '10px',
        marginBottom: '10px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: '#f2e8cf',
        width: '90%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '800px'
    }

});



const IOSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#52d869',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

function MachineLearnPage() {
    const [state, updateState] = useGlobalState()
    const classes = useStyles()
    const [modelTraining, setModelTraining] = React.useState(false)
    // TODO 将默认值和 globalState 中的值进行绑定
    const setting = [
        { type: 'Window Size', min: 1, max: 100, defaultNum: 20, step: 1 },
        { type: 'Number of Hidden Layer', min: 1, max: 50, defaultNum: 4, step: 1 },
        { type: 'Epochs', min: 5, max: 500, defaultNum: 20, step: 1 },
        { type: 'Learning Rate', min: 0.01, max: 10, defaultNum: 0.05, step: 0.01 },
        { type: 'Training Dataset Size (%)', min: 1, max: 100, defaultNum: 80, step: 1 },
        { type: 'Dropout', min: 0, max: 1, defaultNum: 0, step: 0.1 }

    ]
    const startTraining = async () => {
        setModelTraining(true)
        const column = state.labelColumn
        // if (state.model !== '') // exit if the model is trainied
        //     return
        if (state.inputColumn.length !== 0) {
            const { model, modelResult } = await trainComplexModel(
                state.data4Analyse,
                state.windowSize,
                state.epochs,
                state.learningRate,
                state.hiddenLayers,
                state.trainingDataSize,
                state.inputColumn,
                column,
                state.dropout
            )
            updateState('model', model)
            updateState('modelResult', modelResult)
        }
        else {
            const data = state.data4Analyse.map(value => parseFloat(value[column]))
            const { model, modelResult } = await trainSimpleModel(
                data,
                state.windowSize,
                state.epochs,
                state.learningRate,
                state.hiddenLayers,
                state.trainingDataSize,
                state.dropout
            )
            updateState('model', model)
            updateState('modelResult', modelResult)
        }
        setModelTraining(false)
    }
    const clearModel = () => {
        updateState('model', '')
        updateState('modelResult', '')
    }
    const downloadModel = async () => {
        await state.model.save('downloads://model')
    }
    return (
        <div className={classes.root}>
            {state.finishChoose ?
                <Paper elevation={3} className={classes.paper}>
                    <Typography color={'secondary'} variant={'subtitle2'}>
                        If you do not know the means or these chooses
                        <Tooltip
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={'In general, a precise model needs bigger window size, more hidden layers, more epochs, less learning rate, and more data! But please consider these options according the requirements and machine performance! If the model is overfitting, please consider to increase dropout percentage!'}>
                            <HelpIcon fontSize='small' />
                        </Tooltip>
                        , Please use the default values!!
                    </Typography>
                    <Typography variant={'h5'}>
                        Model training setting:
                    </Typography>
                    {
                        setting.map((value, index) =>
                            <CreateChooseBar
                                key={index}
                                type={value.type}
                                min={value.min}
                                max={value.max}
                                defaultNum={value.defaultNum}
                                step={value.step}
                            />
                        )
                    }
                    <FormControlLabel
                        control={
                            <IOSSwitch
                                checked={state.finishSet}
                                onChange={() => updateState('finishSet', !state.finishSet)}
                                name="isFinish" />}
                        label="Finish"
                    />
                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" disabled={state.finishSet && state.model === '' && !modelTraining ? false : true} onClick={startTraining}>Start Training</Button>
                        <Button variant="contained" color="secondary" disabled={state.model === '' ? true : false} onClick={clearModel}>Clear exist model</Button>
                        <Button variant="contained" disabled={state.model === '' ? true : false} onClick={downloadModel}>Model Download</Button>
                    </div>
                </Paper>
                :
                ''
            }
        </div>
    )
}

export default MachineLearnPage

