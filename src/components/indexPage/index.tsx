import * as React from 'react';
import './index.less';
import {Ajax,getCookie} from '../../common/common';
import IndexPage from './indexPage';
import UserSetPage from './userSetPage';
import {UserInfoProtype} from '../../common/commonInterface';
import GamePage from './gamePage';
interface State {
   userInfo:UserInfoProtype;
  activePage:string;
}
class IndexContent extends React.Component<{},State> {//第一个是props,第二个是state，组件内用到的props和state需要符合对应接口的结构,此组件不需用到props，所以此处传{}
    constructor(props:Object) {
        super(props);
        this.state= {
            userInfo:{},
            activePage:'indexPage'
        };
        this.changeContent=this.changeContent.bind(this);
        this.getUserInfo=this.getUserInfo.bind(this);
    }
    componentDidMount() {
       this.getUserInfo();
    }
    getUserInfo() {
        Ajax.post('/getUserInfo',{userId:getCookie('userId')}).then(result=> {
            if(result.isException) {
                if(result.data.length) {
                    this.setState({userInfo:result.data[0]});
                }
            }
        });
    }
    changeContent(activePage) {
       this.setState({activePage});
    }
    public render() {
        const {userInfo,activePage}=this.state;
        let content;
        switch (activePage) {
            case 'indexPage':
                content = <IndexPage changeContent={this.changeContent} userInfo={userInfo} />;
                break;
            case 'userSetPage':
                content = <UserSetPage  changeContent={this.changeContent} userInfo={userInfo} getUserInfo={this.getUserInfo} />;
                break;
            case 'gamePage':
                content = <GamePage  changeContent={this.changeContent} userInfo={userInfo} />;
                break;
            default:
                content=null;
                break;
        }
        return (content);
    }
}

export default IndexContent;

