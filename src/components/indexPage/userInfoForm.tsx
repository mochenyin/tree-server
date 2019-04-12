//选择上传头像
import * as React from 'react';
import {Button,message,Form, Input,Row,Col,Modal} from 'antd';
import '../uploadPic/commonComp.scss';
import {Ajax,setCookie,getCookie,delCookie} from '../../common/common';
import {UserInfoProtype} from '../../common/commonInterface';
import { FormComponentProps } from 'antd/lib/form';
const { TextArea } = Input;
const AES=require('../../common/getInfoByAES');
declare var Array:any;
interface UserFormProps extends FormComponentProps {
    userInfo:UserInfoProtype;
    changeContent:(pageKey:string)=>void;
    getUserInfo:()=>void;
    isUpdatePwdPanel?:boolean;
}
class RegistrationForm extends React.Component<UserFormProps,any> {
    constructor(props:UserFormProps) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
        };
        this.changeContent=this.changeContent.bind(this);
        this.openUpdatePwdPanel=this.openUpdatePwdPanel.bind(this);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const _this=this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let datas=values;
                datas.userId=_this.props.userInfo.userId;
                Ajax.post('/updateUserInfo',{...datas}).then(result=> {
                    if(result.isException) {
                       message.success('保存成功！');
                       _this.props.getUserInfo();
                    }
                });
            }
            else {
                console.error(err);
            }
        });
    }
    getRandomNum=(length)=> {
        let oArray=new Array(length).fill(0);
        oArray=oArray.map(item=> {
            return Math.floor(Math.random()*10);
        });
        return  oArray;
    }
    handleUpdatePwdSubmit=(e,type?:string)=> {
        e.preventDefault();
        const _this=this;
        const userInfo=_this.props.userInfo;
        _this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(type==='getCheckNumber') {
                    if(this.state.isNotSendEmail) {
                        message.warning('请在一分钟后再次发送！');
                    }
                    _this.setState({isNotSendEmail:true});
                    let checkArray=this.getRandomNum(4);
                    let commonArray=this.getRandomNum(9);
                    const checkWords=checkArray.join('');
                    const commonWords=commonArray.join('');
                    const someWords=AES.aesEncrypt(checkWords,commonWords);
                    Ajax.post('/checkMailMsg',{userId:userInfo.userId,email:values.userEmail,someWords,commonWords}).then(result=> {
                        if(result.isException) {
                            message.success('已向该邮箱发送验证码，10分钟内有效');
                            setCookie('commonWords',commonWords,0.007);//10分钟后过期;
                            setCookie('someWords',AES.aesEncrypt(checkWords,commonWords),0.007);//10分钟后过期;
                        }
                    });
                    setTimeout(()=> {
                        _this.setState({isNotSendEmail:false});
                    },10000);
                }
                else if(type==='checkNumber') {
                    _this.setState({isNotCheck:true});
                    if(_this.state.isNotCheck) return;
                    Ajax.post('/checkMail',{userId:userInfo.userId,email:values.userEmail}).then(result=> {
                        if(result.isException&&result.data.length) {
                            let checkNumber=values.checkNumber;
                            if(!checkNumber) {
                                message.error('请输入验证码！');
                                return;
                            }
                            const commonWords=getCookie('commonWords');
                            const someWords=getCookie('someWords');
                            if(!someWords||!commonWords) {
                                message.warning('验证码已失效！');
                                return;
                            }
                            const curentWords=AES.aesDecrypt(someWords,commonWords);
                            if(checkNumber===curentWords) {
                                message.success('验证成功！');
                                _this.setState({isUpdateToPwd:true});
                            }
                            else {
                                message.error('验证失败！');
                            }
                        }
                        else {
                            message.warning('您输入的邮箱与您注册时填写的邮箱不一致！');
                        }
                    }).then(()=> {
                        _this.setState({isNotCheck:false});
                    }).catch(error=> {
                        _this.setState({isNotCheck:false});
                    });
                }
                else {
                    let userPwd=values.userPwd;
                    let confirmPwd=values.confirmPwd;
                    if(userPwd!==confirmPwd) {
                        message.warning('两次输入不一致！');
                        return;
                    }
                    const someWords=AES.aesEncrypt(userPwd,'mochenyin');
                    Ajax.post('/updatePwd',{userId:userInfo.userId,someWords}).then(result=> {
                        if(result.isException) {
                            message.success('修改成功！');
                            _this.openUpdatePwdPanel();
                            _this.loginOut();
                        }
                        else {
                            message.warning('修改失败！');
                        }
                    });
                }
                console.log('Received UpdatePwd values of form: ', values);
            }
            else {
                console.error(err);
            }
        });
    }
    changeContent() {
        this.props.changeContent('indexPage');
    }
    openUpdatePwdPanel() {
        this.setState({isUpdatePwdPanel:!this.state.isUpdatePwdPanel,...this.state.isUpdatePwdPanel?{
                isUpdateToPwd:false,isNotCheck:false,isNotSendEmail:false
            }:{}});
    }
    loginOut() {
        delCookie('userId');
        delCookie('commonWords');
        delCookie('someWords');
        location.reload();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const userInfo=this.props.userInfo;
        const {isUpdatePwdPanel,isUpdateToPwd}=this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 20 },
            },
        };
        const formItemLayout1 = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            [<Form key='userInfoForm' {...formItemLayout} onSubmit={this.handleSubmit} style={{width:'650px',margin:'15px auto'}}>
                <Form.Item
                    label="昵称"
                >
                    {getFieldDecorator('userName', {
                        initialValue:userInfo.userName||'',
                        rules: [{
                            required: true, message: '请输入您的昵称!',
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="真实姓名"
                >
                    {getFieldDecorator('realName',{
                        initialValue:userInfo.realName||'',
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="用户角色"
                >
                    <span>{userInfo.role==='1'?'管理员':'普通用户'}</span>
                </Form.Item>
                <Form.Item
                    label="个性签名"
                >
                    {getFieldDecorator('sign',{
                        initialValue:userInfo.sign||'',
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label="描述"
                >
                    {getFieldDecorator('description',{
                        initialValue:userInfo.description||'',
                    })(
                        <TextArea  rows={4}
                                   autoComplete="off"
                        />
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type='primary' onClick={this.changeContent}>返回</Button>&nbsp;&nbsp;&nbsp;
                    <Button type="primary" htmlType="submit">保存</Button>&nbsp;&nbsp;&nbsp;
                    <span className='colorSpan' onClick={this.openUpdatePwdPanel}>修改密码</span>&nbsp;&nbsp;
                    <span className='colorSpan' onClick={this.loginOut}>退出登录</span>
                </Form.Item>
            </Form>,
                <Modal key='userUpdatePwdModal'
                    title="修改密码"
                    visible={isUpdatePwdPanel}
                    onCancel={this.openUpdatePwdPanel}
                    footer={null}
                >
                    {!isUpdateToPwd?<Row gutter={35}>
                        <Col span={18}>
                            <Form.Item {...formItemLayout1}
                                       label="昵称"
                            >
                                {getFieldDecorator('userEmail', {
                                    initialValue:'',
                                    rules: [{
                                        type: 'email', message: '输入的邮箱不合法!',
                                    },{
                                        required: true, message: '请输入您注册时填写的邮箱!',
                                    }],
                                })(
                                    <Input placeholder='请输入您注册时填写的邮箱' />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <span onClick={(e)=>this.handleUpdatePwdSubmit(e,'getCheckNumber')} className='colorSpan' style={{position:'relative',top:'10px'}}>获取验证码</span>
                        </Col>
                        <Col span={18}>
                            <Form.Item {...formItemLayout1}
                                       label="输入验证码"
                            >
                                {getFieldDecorator('checkNumber', {
                                    initialValue:'',
                                })(
                                    <Input placeholder='请输入您收到的验证码' />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <span onClick={(e)=>this.handleUpdatePwdSubmit(e,'checkNumber')} className='colorSpan' style={{position:'relative',top:'10px'}}>点击进行验证</span>
                        </Col>
                    </Row>:<div>
                        <Form.Item {...formItemLayout}
                            label="密码"
                        >
                            {getFieldDecorator('userPwd', {
                                rules: [{
                                    required: true, message: '请输入密码!',
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout}
                            label="确认密码"
                        >
                            {getFieldDecorator('confirmPwd', {
                                rules: [{
                                    required: true, message: '请输入密码!',
                                }],
                            })(
                                <Input type="password"  />
                            )}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" onClick={this.handleUpdatePwdSubmit}>保存</Button>
                        </Form.Item>
                    </div>}
                </Modal>]
        );
    }
}

const UserInfoForm = Form.create({ name: 'register' })(RegistrationForm);
export default  UserInfoForm;
