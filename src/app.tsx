import * as React from 'react';
import 'STYLE/app.less';
// import Button from  './components/button/index';
// import Modal from './components/modal/index';
// import SelectUploadPic from './components/uploadPic/selectUploadPic';
import {Ajax,setCookie,getCookie} from './common/common';
import {Input,message} from 'antd';
import IndexContent from './components/indexPage/index';
const AES=require('./common/getInfoByAES');
interface State {
    isIndexPage: boolean;
    visible:boolean;
    mousePosition?:{
        x:number,
        y:number
    };
}
declare var hex_md5:any;

class App extends React.Component<{},State> {//第一个是props,第二个是state，组件内用到的props和state需要符合对应接口的结构,此组件不需用到props，所以此处传{}
    private userName: React.RefObject<Input>;
    private userPwd: React.RefObject<Input>;
    constructor(props:Object) {
        super(props);
        this.state= {
            isIndexPage:false,
            visible:false,
        };
        this.userName=React.createRef();
        this.userPwd=React.createRef();
        this.goToIndexPage=this.goToIndexPage.bind(this);
    }
    componentWillMount() {
        if(getCookie('userId')) {
            this.setState({isIndexPage:true});
        }
    }
    goToIndexPage= (e: React.MouseEvent|React.KeyboardEvent,name?:string) => {
        const userName=this.userName.current.state.value;
        const userPwd=this.userPwd.current.state.value;
        if(!userName) {
            message.info('请输入用户名');
            return;
        }
        if(!userPwd) {
            message.info('请输入密码');
            return;
        }
        const someWords=AES.aesEncrypt(userPwd,'mochenyin');
        Ajax.post('/loginIn',{userName,userPwd:someWords}).then(result=> {
            if(result.isException) {
               if(result.data) {
                   setCookie('userId',result.data,1);
                   this.setState({isIndexPage:true});
               }
               else {
                   message.warning('信息有误，请检查登录信息！');
               }
            }
        });
    }
    changeModalVisible=(e: React.MouseEvent,isVisible?:boolean)=> {
        this.setState({visible:isVisible?isVisible:false});
    }
    openModal=(event:React.MouseEvent)=> {
        let mousePosition = {
            x:null,
            y:null
        };
        mousePosition.x=event.clientX;
        mousePosition.y=event.clientY;
        console.error(mousePosition);
    }
    handleOk=(e:React.MouseEvent)=> {
        alert('成功关闭');
        this.changeModalVisible(e);
    }
  public render() {
    return (
        !this.state.isIndexPage?
            <div className="startPage">
                    <img src={'STATIC/images/logo.svg'} className="startLogo" alt="logo" />
                    <div className='loginPanel'>
                        <span>欢迎登录</span>
                        <hr />
                        <Input size='large' allowClear={true} type='text' ref={this.userName} placeholder='请输入用户名' onPressEnter={this.goToIndexPage} />
                        <Input size='large' allowClear={true} type='password' ref={this.userPwd} placeholder='请输入密码' onPressEnter={this.goToIndexPage} />
                    </div>
                    <p onClick={this.goToIndexPage} className='startLink'>go to indexPage!</p>
            </div> :<IndexContent />
    );
  }
}

export default App;

{/*<Button onClick={this.goToIndexPage} type={'primary'} size={'middle'}>return to startPage!</Button>&nbsp;&nbsp;
            <Button onClick={this.goToIndexPage} type={'success'} size={'middle'}>return to startPage!</Button>&nbsp;&nbsp;
            <Button onClick={this.goToIndexPage} type={'warning'} size={'middle'}>return to startPage!</Button>&nbsp;&nbsp;
            <Button onClick={this.goToIndexPage} type={'error'}   size={'middle'}>return to startPage!</Button>&nbsp;&nbsp;
            <Button onClick={this.goToIndexPage} type={'passion'} size={'middle'}>return to startPage!</Button>&nbsp;&nbsp;
            <Button onClick={this.goToIndexPage} type={'primary'} size={'small'}>return to startPage!</Button>&nbsp;&nbsp;
            <Button onClick={this.goToIndexPage} type={'success'} size={'small'}>return to startPage!</Button>&nbsp;&nbsp;
            <Button onClick={this.goToIndexPage} type={'warning'} size={'small'}>return to startPage!</Button>&nbsp;&nbsp;
            <Button onClick={this.goToIndexPage} type={'error'}   size={'small'}>return to startPage!</Button>&nbsp;&nbsp;
            <Button onClick={this.goToIndexPage} type={'passion'} size={'small'}>return to startPage!</Button><br /><br />
            <Button onClick={(e)=>this.changeModalVisible(e,true)} type={'passion'} size={'small'}>open Modal!</Button>&nbsp;&nbsp;
            <Modal visible={this.state.visible}  title='Basic Modal' width={500} onCancel={this.changeModalVisible} onOk={this.handleOk}>
                <p>some contents...</p>
                <p>some contents...</p>
                <p>some contents...</p>
            </Modal>
            <SelectUploadPic />*/}