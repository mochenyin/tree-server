//选择上传头像
import * as React from 'react';
import {Button,message,Upload,Form, Input,Row,Col} from 'antd';
import '../uploadPic/commonComp.scss';
const Dragger = Upload.Dragger;
import {Ajax} from '../../common/common';
import {UserInfoProtype} from '../../common/commonInterface';
import UserInfoForm from './userInfoForm';
const { TextArea } = Input;
interface State {
    userInfo?:UserInfoProtype;
    userImg:string;
}
interface Props {
    userInfo: UserInfoProtype;
    changeContent:(pageKey:string)=>void;
    getUserInfo:()=>void;
}
export default class UserSetPage extends React.Component<Props,State> {
    constructor(props:Props) {
        super(props);
        this.state= {
            userImg:''
        };
        this.changeContent=this.changeContent.bind(this);
    }
    componentDidMount() {//服务端渲染时，如果在willMount时调用ajax，会报错，因为node环境没有window这个对象，解决方法：1可以在didMount里执行，2使用懒加载
        Ajax.post('/getUserInfo',{userId:1}).then(result=> {
            if(result.isException&&result.data.length) {
                this.setState({userInfo:result.data[0],userImg:result.data[0].userImg});
            }
            console.log('testResult',result);
        });
        // require.ensure([],(require:NodeRequire)=>{
        //     require('./commonComp.scss');
        // },"commonComp");
    }
    changeContent() {
        this.props.changeContent('indexPage');
    }
    render() {
        let {userImg}=this.state;
        const {userInfo}=this.props;
        const _this=this;
        const userPicUrl="/static/images/"+(userImg?userImg:'001.jpg');
        return <div id="updateUserImg">
            <img alt="userImg" className='userImg' src={userPicUrl} />
            <div className="userImgPanel" style={{backgroundImage:`url(${userPicUrl})`}}>
                <div className='circle'>
                    <div className='circle1'>
                        <div className='circle2'>

                        </div>
                    </div>
                </div>
            </div>
            <Dragger {...{
                name: 'file',
                multiple: false,
                action: '/api/uploadUserImg',
                data:(file)=> {return {userId:userInfo.userId};},
                onChange(info) {
                    const status = info.file.status;
                    if (status !== 'uploading') {
                        console.log(info.file, info.fileList);
                    }
                    if (status === 'done') {
                        if(info.file.response&&info.file.response.isException) {
                            message.success(`${info.file.name} file uploaded successfully.`);
                            _this.setState({userImg:info.file.name});
                            _this.props.getUserInfo();
                        }
                    } else if (status === 'error') {
                        message.error(`${info.file.name} file upload failed.`);
                    }
                },
            }}>
               <span>Click Or Drag Picture Here To Upload</span>
            </Dragger>
            <UserInfoForm userInfo={userInfo} changeContent={this.props.changeContent} getUserInfo={this.props.getUserInfo}/>
        </div>;
    }
}

