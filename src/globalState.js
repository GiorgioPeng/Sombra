import React, { useState, createContext, useContext, } from 'react';

const GloalStateContext = createContext(null)

const initState = {
    data: undefined,// 这里保存的是当次需要分析的用于可视化表格的数据
    data4Analyse:'', // 这里保存的是用于分析的数据格式
    column:[], // 这里保存的是当次需要分析的数据中所有的表头名称
    timeColumn:'', // 这里保存的是时序字段的字段名称
    labelColumn:'', // 这里保存的是因变量字段
    inputColumn:[], // 这里保存的是自变量字段
    constantColumn:[] // 这里保存的是无关字段
    /**
     * [columns...]
     * [row data]
     * [row data]
     */
};

export function GlobalStateProvider({ children }) {
    const [state, setState] = useState(initState);

    const updateState = (key,value)=>{
        console.log(key,value)
        setState((lastState)=>{
            return{
                ...lastState,
                [key]:value
            }
        })
    }
    return (
        <GloalStateContext.Provider value={[state, updateState]}>
            {children}
        </GloalStateContext.Provider>
    )
}
export function useGlobalState() {
    return useContext(GloalStateContext)
}