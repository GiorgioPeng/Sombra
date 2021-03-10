import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import createGraph from '../utils/createGraph'

const useStyles = makeStyles((theme) => ({
    graphContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
}));
function LinePicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const linePictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    const width = 800;
    const height = 500; // 高度可能根据图的大小进行更改
    React.useEffect(() => {
        if (linePictureRef.current) {
            const graphArr = []
            if (state.labelColumn.length !== 0) {
                if (state.inputColumn.length !== 0) {// 以其他变量为x轴的数据拆分
                    let count = 0;
                    for (const label of state.labelColumn) {
                        let dataArr = [];
                        let xLabel = '';
                        for (const input of state.inputColumn) {
                            let data = {}
                            data.x = state.data4Analyse.map((value) => value[input])
                            data.y = state.data4Analyse.map((value) => value[label])
                            data.type = 'histogram2d'
                            data.name = input
                            dataArr.push(data)
                            xLabel.length === 0 ? xLabel += input : xLabel += ', ' + input
                        }
                        graphArr.push(createGraph(dataArr, 'histogram2d', width, height, xLabel, label))
                        count++;
                    }
                }
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
        </div>
    )
}
export default LinePicture