import * as React from 'react';

interface DialogProps {
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

function insertSpace(child: React.ReactChild) {
    // Check the child if is undefined or null.
    if (child == null) {
        return;
    }
    if (typeof child === 'string') {
        return <span>{child}</span>;
    }
    return child;
}

interface State {

}

class Dialog extends React.Component<DialogProps,State> {
   constructor(props:DialogProps) {
       super(props);
       this.state= {

       };
   }
   clickMask=(e:React.MouseEvent<HTMLDivElement>)=> {
       e.stopPropagation();
       const {maskClosable,onCancel}=this.props;
       if(!maskClosable||(e.target as HTMLElement).className!=='modal-mask') return;
       if(onCancel) {
           onCancel(e);
       }
   }
   render() {
       const {closable,title,width,style,children,visible,footer}=this.props;
       let modalStyle:React.CSSProperties= {};
       if(style) {
           modalStyle=Object.assign({},style);
       }
       if(width) {
           modalStyle.width=width+'px';
       }
       return (<div className='modal-mask' style={{display:visible?'block':'none'}} onClick={this.clickMask}>
           <div className={visible?'modal myAnimate1':'modal'} style={modalStyle}>
               {(closable||closable===undefined)?<span className='modal-icon-close' onClick={this.props.onCancel}>+</span>:''}
               <div className='modal-header'>{title?<div className='modal-title'>{title}</div>:''}</div>
               {children?<div className='modal-body'>
                   {React.Children.map(children, child => <span>{child}</span>)}
               </div>:''}
               {footer===null?'': <div className='modal-footer'>
                       {typeof footer==='function'?footer():footer}
               </div>}
           </div>
       </div>);
   }
}

export default Dialog;