import * as React from 'react';
import './style.less';
import Dialog from './modal';
import Button from '../button/index';

interface ModalProps {
    visible:boolean;//控制modal是否可见
    width?:number|string;//modal框宽度，高度根据内容自动调整
    title?:React.ReactNode|string;//modal标题
    content?:React.ReactNode;//modal主体
    okText?:string;//确定按钮提示文字
    cancelText?:string;//取消按钮提示文字
    maskClosable?:boolean;//点击蒙层是否关闭对话框
    footer?:React.ReactNode;//底部内容
    onOk?:(e: React.MouseEvent<any>)=>void;//点击确认按钮执行的回调函数
    onCancel?:(e: React.MouseEvent<any>)=>void;//点击取消按钮执行的回调函数
    style?:React.CSSProperties;//对话框自定义样式
    mask?:boolean;//是否需要遮罩层
    className?:string;//对话框自定义className
    closable?:boolean;//是否显示右上角关闭按钮
}

class Modal extends React.Component<ModalProps,{}> {
    handleOk=(e:React.MouseEvent<HTMLButtonElement>)=> {
        const {onOk}=this.props;
        if(onOk) {
            onOk(e);
        }
    }
    handleCancel=(e:React.MouseEvent<HTMLButtonElement>)=> {
       const {onCancel}=this.props;
       if(onCancel) {
           onCancel(e);
       }
    }
   initFooter=()=> {
     const {okText,cancelText}=this.props;
     return ([<Button size='middle' key='modal-btn-cancel' type='warning' style={{marginRight:'8px'}} onClick={this.handleCancel}>{cancelText||'取消'}</Button>,
         <Button size='middle' key='modal-btn-ok' type='success' onClick={this.handleOk}>{okText||'确定'}</Button>]);
   }
   render() {
       const {footer,visible,...restProps}=this.props;
       const defaultFooter=this.initFooter;
       return (<Dialog
           {...restProps}
           footer={footer===undefined?defaultFooter:footer}
           visible={visible}
       />);
   }
}

export default Modal;


