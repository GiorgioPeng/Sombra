import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import MiniLinePicture from './MiniLinePicture'
import createGraph from '../utils/createGraph'

const useStyles = makeStyles((theme) => ({
    graphContainer: {
        maxWidth: '90vw',
        overflowX: 'scroll',
        marginTop: '10px',
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));
function LinePicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const linePictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    const width = 400;
    const height = 500; // 高度可能根据图的大小进行更改
    React.useEffect(() => {
        if (linePictureRef.current) {
            const graphArr = []
            if (state.labelColumn.length !== 0) {// 以时间为x轴的数据拆分
                let dataArr = [];
                let yLabel = ''
                for (const label of state.labelColumn) {
                    let data = {}
                    data.x = state.data4Analyse.map((value) => value[state.timeColumn])
                    data.y = state.data4Analyse.map((value) => value[label])
                    data.type = 'line'
                    data.name = label
                    yLabel.length === 0 ? yLabel += label : yLabel += ', ' + label
                    dataArr.push(data)
                }
                graphArr.push(createGraph(dataArr, 'line', width, height, state.timeColumn, yLabel))

                // if (state.inputColumn.length !== 0) {// 以其他变量为x轴的数据拆分
                //     // let count = 0;
                //     let dataArr = [];
                //     let yLabel = ''
                //     for (const input of state.inputColumn) {
                //         let data = {}
                //         data.y = state.data4Analyse.map((value) => value[input])
                //         data.x = state.data4Analyse.map((value) => value[state.timeColumn])
                //         data.type = 'line'
                //         data.name = input
                //         // yLabel.length === 0 ? yLabel += input : yLabel += ', ' + input
                //         dataArr.push(data)
                //     }
                //     graphArr.push(createGraph(dataArr, 'line', width, height, state.timeColumn, yLabel))
                //     // count++;
                // }
                setInnerGraph(graphArr)
            }
            return () => {
                setInnerGraph([])
            }
        }
    }, [])
    return (
        <div ref={linePictureRef} className={classes.graphContainer}>
            {innerGraph?.map(e => e)}
            {state.inputColumn.length !== 0 ? <MiniLinePicture /> : ''}
        </div>
    )
}
export default LinePicture