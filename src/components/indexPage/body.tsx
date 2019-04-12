import * as React from 'react';

interface State {
    screenWidth:number;
    rows:number;
}

export default class IndexBody extends React.Component<{},State> {
    constructor(props:Object) {
        super(props);
        this.state= {
            screenWidth:window.screen.width,
            rows:4,
        };
        this.resize=this.resize.bind(this);
    }
    shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<State>) {
       return this.state.rows!==nextState.rows;
    }

    componentDidMount() {
        const {screenWidth}=this.state;
        let rows=Math.floor(screenWidth/240);
        if(rows===(screenWidth/240)) {
            rows-=1;
        }
        this.setState({rows});
        window.addEventListener('resize', this.resize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }
    resize(e) {
        const screenWidth=e.target.innerWidth;
        let rows=Math.floor(screenWidth/240);
        if(rows===(screenWidth/240)) {
            rows-=1;
        }
        this.setState({screenWidth,rows});
    }
    clickItem:React.MouseEventHandler<HTMLDivElement>=e=> {
        console.log(e.target);
    }
    render() {
        const {rows}=this.state;
        const bodyWidth=240*rows;
        return (
            <div id="indexBody" style={{width:`${bodyWidth}px`}} onClick={this.clickItem}>
                {new Array(rows).fill(0).map((item,index)=> {
                    return <div className='singleCol' key={'singleCol'+index}>
                        {new Array(15).fill(0).map((a,b)=> {
                            const index=Math.floor(Math.random()*10);
                            return <div className='singleItem' key={'singleItem'+b}>
                                <img alt={'subImg'+b} src={'/static/images/pic'+index+'.png'} />
                                <p className='text'>【MY CLIP】スタディオクリップがお届けする、よりみち発見ジャーナル。
                                    スタディオスタディオクリップがお届けする、よりみち発見ジャーナル。 : スタディオ...
                                </p>
                                <p className='author' style={{color:'#FF7A39'}}>mochenyin</p>
                            </div>;
                        })}
                    </div>;
                })}
            </div>
        );
    }
}