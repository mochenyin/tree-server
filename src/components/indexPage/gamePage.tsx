import * as React from 'react';
import {message,Button} from 'antd';
import {UserInfoProtype} from "../../common/commonInterface";

interface Props {
    userInfo: UserInfoProtype;
    changeContent:(pageKey:string)=>void;
}

interface C{
    X:number;
    Y:number;
    flb:number;//0为黑子1为红子
}

interface State {
    initTop?:number;
    initLeft?:number;
    datas:Array<C>,
    flb:number;
    isChecking?:boolean;
}

export default class GamePage extends React.Component<Props,State>{
    private barderRef: React.RefObject<HTMLDivElement>;
    constructor(props:Props){
        super(props);
        this.state={
            initTop:0,
            initLeft:0,
            datas:[],
            flb:0
        };
        this.barderRef=React.createRef();
        this.reStart=this.reStart.bind(this);
    }
    componentDidMount(){
        this.setState({
            initLeft:this.barderRef.current.offsetLeft,
            initTop:this.barderRef.current.offsetTop
        });
    }
    clickBarder:React.MouseEventHandler<HTMLDivElement>=e=>{
        if(this.state.isChecking) return;
        let X=this.getPosition(e.clientX-this.state.initLeft);
        let Y=this.getPosition(e.clientY-this.state.initTop);
        if(X===-1||Y===-1) return;
        let datas=this.state.datas;
        const lastDatas=datas.filter(item=>item.X===X&&item.Y===Y);
        if(lastDatas.length) return;
        datas.push({X,Y,flb:this.state.flb});
        this.setState({datas,flb:this.state.flb===0?1:0,isChecking:true},()=>{
            this.checkChampion(datas,X,Y);
        });
        console.log(e.clientX,e.clientY,X,Y)
    };
    checkChampion(datas:Array<C>,X:number,Y:number){
        const dataSource=datas.filter(item=>item.flb===(this.state.flb===0?1:0));
        if(this.checkC(dataSource,X,Y,'Y','X')){
            message.success(this.state.flb===0?'白子胜!':'黑子胜!');
            return;
        }
        if(this.checkC(dataSource,Y,X,'X','Y')){
            message.success(this.state.flb===0?'白子胜!':'黑子胜!');
            return;
        }
        if(this.checkS(dataSource,X,Y,true)){
            message.success(this.state.flb===0?'白子胜!':'黑子胜!');
            return;
        }
        if(this.checkS(dataSource,X,Y,false)){
            message.success(this.state.flb===0?'白子胜!':'黑子胜!');
            return;
        }
        this.setState({isChecking:false})
    }
    checkC(dataSource,lang1,lang2,name1,name2){
        let length1=0;
        let length2=0;
        let newDatas=dataSource.filter(item=>lang2===item[name1]);
        if(newDatas.length>3){
            newDatas.sort((a,b)=>a[name2]-b[name2]).forEach(item=>{
               if(item[name2]>lang1&&(item[name2]-lang1)===(length1+1)){
                   length1++;
               }

            });
            newDatas.sort((a,b)=>b[name2]-a[name2]).forEach(item=>{
                if(item[name2]<lang1&&(lang1-item[name2])===(length2+1)){
                    length2++;
                }
            })
        }
      return (length1+length2)>3;//因为把当前下的棋子排除了，所以此处有大于3个即可
    }
    checkS(dataSource,X,Y,flag){
        let length1=0;
        let length2=0;
        let newDatas=dataSource.filter(item=>X!==item.X&&Y!==item.Y);
        if(newDatas.length>3){
            newDatas.sort((a,b)=>a.X-b.X).forEach(item=>{
               if(X<item.X&&(item.X-X)===(length1+1)&&(item.Y-Y)===flag?(length1+1):(0-length1-1)){
                   length1++;
               }
            });
            newDatas.sort((a,b)=>b.X-a.X).forEach(item=>{
                if(X>item.X&&(X-item.X)===(length2+1)&&(item.Y-Y)===flag?(0-length2-1):(length2+1)){
                    length2++;
                }
            })
        }
        return (length1+length2)>3;//因为把当前下的棋子排除了，所以此处有大于3个即可
    }
    getPosition(lang){
        let index=-1;
        for(let i=0;i<16;i++){
            if(Math.abs(lang-40*i)<=10){
                index=i;
                break;
            }
        }
        return index;
    }
    reStart(){
        this.setState({datas:[],isChecking:false})
    }
    render(){
        const {datas,flb}=this.state;
        return (<div id="gamePage">
            <div className="barder" ref={this.barderRef} onClick={this.clickBarder}>
                {new Array(16).fill(0).map((aItem,aIndex)=>{
                    let className='singleItem';
                    if(aIndex===15){
                        className+=' noBorderBottom';
                    }
                    return new Array(16).fill(0).map((bItem,bIndex)=>{
                        if(bIndex===15){
                            className+=' noBorderRight';
                        }
                        return <span key={'a'+aIndex+'b'+bIndex} className={className}>

                        </span>
                    })
                })}
                {datas.map((item,index)=>{
                    return <span key={'X'+item.X+'Y'+item.Y+'B'+item.flb}
                                 className={'singleCircle'+(item.flb===0?' black':' white')}
                                 style={{top:(40*item.Y-10)+'px',left:(40*item.X-10)+'px'}}>

                    </span>
                })}
            </div>
            <span className='gameTitle'>黑子数：{datas.filter(item=>item.flb===0).length}&nbsp;&nbsp;&nbsp;
                红子数：{datas.filter(item=>item.flb===1).length}&nbsp;&nbsp;&nbsp;下一步：{flb===0?'黑子':'红子'}&nbsp;&nbsp;&nbsp;
                <Button type='primary' onClick={this.reStart}>重新开局</Button></span>
        </div>)
    }
}