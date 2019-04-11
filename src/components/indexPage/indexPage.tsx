import * as React from 'react';
import './index.less';
import {Ajax,getCookie} from '../../common/common'
import {Input,message,Popover,Row,Col} from 'antd';
import IndexBody from './body';
import {UserInfoProtype} from '../../common/commonInterface'

interface State {
    className:string;
    isUpdateClassName:boolean;
    imageTop:number;
}
interface Props{
    userInfo: UserInfoProtype;
    changeContent:(pageKey:string)=>void;
};
const tabIndex=Math.ceil(Math.random()*10/3);
class IndexPage extends React.Component<Props,State>{//第一个是props,第二个是state，组件内用到的props和state需要符合对应接口的结构,此组件不需用到props，所以此处传{}
    private bodyBox: React.RefObject<HTMLDivElement>;
    constructor(props:Props){
        super(props);
        this.state={
            className:'headerPanel',
            isUpdateClassName:false,
            imageTop:120,
        };
        this.bodyBox=React.createRef();
        this.changeContent=this.changeContent.bind(this);
    }
    onScroll=()=>{
        const imageTop=this.bodyBox.current.scrollTop;
        if(imageTop>280) return;
        let initTop=this.state.imageTop;
        if(imageTop>50&&!this.state.isUpdateClassName){
            this.setState({className:'headerPanel specialHeader',isUpdateClassName:true})
        }
        else if(imageTop<50&&this.state.isUpdateClassName){
            this.setState({className:'headerPanel',isUpdateClassName:false})
        }
        if(imageTop<280){
            if(imageTop<initTop){
                this.setState({imageTop:imageTop===0?120:initTop-7})
            }
            else{
                this.setState({imageTop:initTop+7})
            }
        }
    };
    clickIndexLogo(){
        location.reload();
    }
    changeContent(pageKey:string){
      this.props.changeContent(pageKey)
    }
    public render() {
        const {className,imageTop}=this.state;
        const {userInfo}=this.props;
        const content=<Row style={{width:'180px'}}>
            {['首页','发现','最新','活动','美素','设计服务','花瓣LIVE','美物'].map((item,index)=><Col key={'header-smallCol'+index} span={8} >{item}</Col>)}
        </Row>;
        const userImg=userInfo.userImg;
        return (
            <div id="indexPage" ref={this.bodyBox} onScroll={this.onScroll}>
                <div className={className}>
                    <div className='header'>
                         <span className='logoText' onClick={this.clickIndexLogo}>
                          <img alt="logo" className='subLogo' src='/static/images/logo.svg' />
                            React
                           </span>
                        {['首页','发现','最新'].map((item,index)=><span className='commonItem' key={'header-commonItem0'+index}>{item}</span>)}
                        <Popover content={content} title="可选择项">
                            <span className='commonItem etcItem'>...&nbsp;&nbsp;&nbsp;&nbsp;|</span>
                        </Popover>
                        {['活动','美素','设计服务','花瓣LIVE','美物'].map((item,index)=><span className='commonItem' key={'header-commonItem1'+index}>{item}</span>)}
                    </div>
                    <div className='userInfo'>
                        <img onClick={()=>this.changeContent('userSetPage')} src={"/static/images/"+(userImg?userImg:'001.jpg')} alt="userImg" className='userImg' />
                        &nbsp;&nbsp;&nbsp;{userInfo.userName||'游客'}&nbsp;&nbsp;
                        <span style={{cursor:'pointer'}} onClick={()=>this.changeContent('gamePage')}>GAME</span>
                    </div>
                </div>
                <div className='topPanel' style={{backgroundImage:`url("/static/images/tab${tabIndex}.png")`,backgroundPosition:`center ${-imageTop}px`}}>
                    <div className='content'>
                        <p>花瓣，陪你做生活的设计师</p>
                        <Input size='large' placeholder='搜索你喜欢的' allowClear={true} />
                    </div>
                </div>
                <IndexBody />
            </div>
        );
    }
}

export default IndexPage;

