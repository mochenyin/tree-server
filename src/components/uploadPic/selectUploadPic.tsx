//选择上传头像
import * as React from 'react';
import {Button,message,Upload,Icon} from 'antd';
import './commonComp.scss';
const Dragger = Upload.Dragger;
import {Ajax} from '../../common/common';

interface State {
    userInfo?:object;
    userImg:string;
}

export default class SelectUploadPic extends React.Component<{},State> {
    constructor(props) {
        super(props);
        this.state= {
            userImg:''
        };
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
    render() {
        let {userImg}=this.state;
        const _this=this;
        return <div id="updateUserImg">
            <Button type="primary">click</Button>
            <div className="userImg">
                <img src={"/static/images/"+(userImg?userImg:'001.jpg')} width="250" height="250"/>
            </div>
            <Dragger {...{
                name: 'file',
                multiple: false,
                action: '/api/uploadUserImg',
                data:(file)=> {return {userId:1};},
                onChange(info) {
                    const status = info.file.status;
                    if (status !== 'uploading') {
                        console.log(info.file, info.fileList);
                    }
                    if (status === 'done') {
                        if(info.file.response&&info.file.response.isException) {
                            message.success(`${info.file.name} file uploaded successfully.`);
                            _this.setState({userImg:info.file.name});
                        }
                    } else if (status === 'error') {
                        message.error(`${info.file.name} file upload failed.`);
                    }
                },
            }}>
                <Icon type="inbox" /><br /><span>Click Or Drag Picture Here To Upload</span>
            </Dragger>
        </div>;
    }
}
